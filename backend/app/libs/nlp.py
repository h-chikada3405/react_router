import vibrato
import zstandard
import math
import threading
from typing import List, Dict
from rapidfuzz import fuzz

exclude_keywords = {
  '株式会社', '株式', '株', '有限会社', '有限', '会社', '事業', '法人', '団体',
  'かぶしき', 'かぶしきがいしゃ', 'かぶしきがいしゃ', 'ゆうげんがいしゃ', 'ゆうげん',
  'かいしゃ', 'じぎょう', 'ほうじん', 'だんたい', 'ぐるーぷ',
  'カブシキ', 'カブシキガイシャ', 'ユウゲンガイシャ', 'ユウゲン',
  'カイシャ', 'ジギョウ', 'ホウジン', 'ダンタイ', 'グループ',
}
"""
検索から除外するキーワードのセット

このセットには、会社名や組織名によく使用される一般的な単語や表現が含まれています。
これらのキーワードは、検索結果の精度を向上させるために、検索クエリから除外されます。
"""


_tokenizer = None
_tokenizer_lock = threading.Lock()

def _get_tokenizer():
  """
  トークナイザーオブジェクトを取得

  初期化処理はスレッドセーフで、複数スレッドが同時に
  初期化を試みた場合でも、1回のみ実行されます。
  """
  global _tokenizer
  if _tokenizer is None:
    with _tokenizer_lock:
      if _tokenizer is None:
        dctx = zstandard.ZstdDecompressor()
        with open('app/dictionary/system.dic.zst', 'rb') as fp:
          with dctx.stream_reader(fp) as dict_reader:
            _tokenizer = vibrato.Vibrato(dict_reader.read())
  return _tokenizer


def tokenize(text: str) -> List[str]:
  """
  与えられたテキストをトークン化し、表層形と読み仮名のリストを返す

  Args:
    text (str): トークン化する入力テキスト

  Returns:
    List[str]: トークンの表層形と読み仮名を含むリスト

  Example:
    >>> tokenize("こんにちは世界")
    ['こんにちは', 'コンニチハ', '世界', 'セカイ']
  """
  tokenizer = _get_tokenizer()
  tokens = tokenizer.tokenize(text)
  result = []
  for token in tokens:
    surface = token.surface() if callable(token.surface) else token.surface
    reading = token.feature().split(',')[7] if callable(token.feature) and len(token.feature().split(',')) > 7 else ''
    result.append(surface)
    if reading:
      result.append(reading)
  return result


def scoring(
  target_text: str,
  target_kana: str | None,
  query_tokens: List[str],
  word_freq: Dict[str, int],
  total_docs: int
) -> float:
  """
  ターゲットテキストとクエリトークンの関連性スコアを計算するアルゴリズム

  Args:
    target_text (str): スコアリング対象のテキスト
    target_kana (str | None): スコアリング対象のカナ
    query_tokens (List[str]): クエリから生成されたトークンのリスト
    word_freq (Dict[str, int]): 全文書中の各単語の出現頻度
    total_docs (int): 全文書数

  Returns:
    float: 計算された関連性スコア

  Example:
    >>> scoring("こんにちは世界", ["こんにちは", "コンニチハ", "世界", "セカイ"], {"こんにちは": 10, "世界": 5}, 100)
    3.2
  """
  BASE_WEIGHT = 1.0
  LENGTH_WEIGHT = 0.1
  TFIDF_WEIGHT = 0.5
  LEVENSHTEIN_WEIGHT = 0.3

  # ターゲットテキストのスコア計算
  matched_tokens_text = [token for token in query_tokens if token in target_text]
  # 基本スコア: マッチした単語の数
  base_score_text = len(matched_tokens_text) * BASE_WEIGHT
  # ボーナススコア: マッチした単語の長さに基づく
  length_score_text = sum(len(token) for token in matched_tokens_text) * LENGTH_WEIGHT
  # TF-IDF スコア
  tfidf_score_text = sum(
    (1 + math.log(target_text.count(token) + 1)) * math.log((total_docs + 1) / (word_freq.get(token, 1) + 1))
    for token in matched_tokens_text
  ) * TFIDF_WEIGHT
  # レーベンシュタイン距離スコア
  levenshtein_score_text = sum(
    fuzz.ratio(token, word) / 100
    for token in query_tokens
    for word in target_text.split()
  ) * LEVENSHTEIN_WEIGHT

  # カナのスコア計算
  kana_score = 0.0
  if target_kana:
    matched_tokens_kana = [token for token in query_tokens if token in target_kana]
    # 基本スコア: マッチした単語の数
    base_score_kana = len(matched_tokens_kana) * BASE_WEIGHT
    # ボーナススコア: マッチした単語の長さに基づく
    length_score_kana = sum(len(token) for token in matched_tokens_kana) * LENGTH_WEIGHT
    # レーベンシュタイン距離スコア
    levenshtein_score_kana = sum(
      fuzz.ratio(token, word) / 100
      for token in query_tokens
      for word in target_kana.split()
    ) * LEVENSHTEIN_WEIGHT

    kana_score = base_score_kana + length_score_kana + levenshtein_score_kana

  # 最終スコアの合計
  final_score = (
    base_score_text + length_score_text + tfidf_score_text + levenshtein_score_text + kana_score
  )

  return final_score
