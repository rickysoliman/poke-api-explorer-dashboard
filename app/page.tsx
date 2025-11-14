import Image from "next/image";

export default async function Home() {
  const url = "https://pokeapi.co/api/v2/pokemon/ditto";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await response.json();

  return <div>{JSON.stringify(data)}</div>;
}
