import { connectToDatabase } from "../../util/mongodb";

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  console.log(db);
  const data = await db
    .collection("listingsAndReviews")
    .aggregate(
      // aggregations represent pipelines in a stage
      [
        {
          $search: {
            search: {
              query: req.query.term,
              path: ["description", "amenities"],
            },
          },
        },
        {
          $project: {
            description: 1,
            amenities: 1,
          },
        },
        {
          $limit: 20,
        },
      ]
    )
    .toArray();

  res.json(data);
}
