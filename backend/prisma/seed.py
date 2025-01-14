import re
from prisma import Prisma
from colorama import Fore, Style
from faker import Faker
from app.libs.nlp import tokenize
from app.libs.maps import get_coordinates

async def main():
  prisma = Prisma()
  fake = Faker('ja_JP')

  try:
    await prisma.connect()

    # client
    await prisma.client.delete_many()
    await prisma.execute_raw('TRUNCATE TABLE "clients" RESTART IDENTITY;')
    clients_data = []
    for _ in range(100):
      company_name = fake.company()
      address = fake.address()
      coordinates = get_coordinates(address)

      if coordinates:
        lat, lng = coordinates["lat"], coordinates["lng"]
      else:
        lat, lng = None, None

      client_data = {
        "name": company_name,
        "kana": ''.join(token for token in tokenize(company_name) if re.match(r'^[\u30A0-\u30FF]+$', token)),
        "postal_code": fake.postcode(),
        "address": address,
        "tel": fake.phone_number(),
        "email": fake.email(),
        "latitude": lat,
        "longitude": lng,
      }
      clients_data.append(client_data)

    created_clients = await prisma.clients.create_many(data=clients_data)
    print(f'🌱 created clients: {created_clients}')

    await prisma.disconnect()
    print(Fore.GREEN + "✅ Database seeding completed successfully." + Style.RESET_ALL)
  except Exception as e:
    print(Fore.RED + f"❌ An error occurred: {e}" + Style.RESET_ALL)

if __name__ == '__main__':
  import asyncio
  asyncio.run(main())
