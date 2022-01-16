import Head from "next/head";
import { connectToDatabase } from "../util/mongodb";

export default function Home({ properties }) {
  console.log("properties", properties);
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
      address: property.summary,

      price: price.$numberDecimal,
    };
  });

  return {
    props: { properties: filtered },
  };
}
