import Head from "next/head";
import { connectToDatabase } from "../util/mongodb";

export default function Home({ properties }) {
  console.log(properties);

  const book = async (property) => {
    const data = await fetch(
      `http://localhost:3000/api/book?property_id=${property._id}&guest=Carlo`
    );
    const res = await data.json();
    console.log("res", res);
  };
  return (
    <div className="container">
      <Head>
        <title>Create next app</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
          rel="stylesheet"
        />
      </Head>

      <div className="flex flex-row flex-wrap">
        {properties &&
          properties.map((property) => (
            <div className="flex-auto w-1/4 rounded overflow-hidden shadow-lg m-2">
              <img className="w-full" src={property.image} />
              <div className="px-6 py-4">
                <div className="font bold text-xl mb-2">
                  {property.name} (Up to {property.accommodates} guests)
                  <p className="text-gray-700 text-base">
                    {property.address.street}
                  </p>
                  <p className="text-gray-600 text-base"> {property.summary}</p>
                </div>
              </div>

              <div className="text-center py-2 my-2 font-bold">
                <span className="text-green-500">${property.price}</span>/night
              </div>

              <div className="text-center py-2 my-2">
                <button
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-b rounded"
                  onClick={() => book(property)}
                >
                  book
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { db } = await connectToDatabase();

  const data = await db
    .collection("listingsAndReviews")
    .find({})
    .limit(20)
    .toArray();

  const properties = JSON.parse(JSON.stringify(data));
  console.log("properties", properties);

  const filtered = properties.map((property) => {
    const price = JSON.parse(JSON.stringify(property.price));
    return {
      //props
      _id: property._id,
      name: property.name,
      image: property.images.picture_url,
      address: property.address,
      summary: property.summary,
      description: property.description,
      accommodates: property.accommodates,
      price: price.$numberDecimal,
    };
  });

  return {
    props: { properties: filtered },
  };
}
