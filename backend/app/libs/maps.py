import requests
from urllib.parse import quote
from colorama import Fore, Style

def get_coordinates(address: str):
    """
    住所をもとに緯度経度を取得する関数

    Args:
      address (str): 緯度経度を取得したい住所

    Returns:
      dict | None: 緯度経度オブジェクト、または None
    """
    encoded_address = quote(address)
    api_url = f"https://msearch.gsi.go.jp/address-search/AddressSearch?q={encoded_address}"

    try:
      response = requests.get(api_url)
      response.raise_for_status()
      data = response.json()

      if len(data) > 0:
        longitude, latitude = data[0]['geometry']['coordinates']
        return {"lat": latitude, "lng": longitude}
      else:
        return None
    except Exception as e:
      print(Fore.RED + f"Error fetching coordinates: {e}" + Style.RESET_ALL)
      return None
