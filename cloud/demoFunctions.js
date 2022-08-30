
Parse.Cloud.define("averageStarsForType", async (request) => {
  const query = new Parse.Query("RatingEntry");
  query.equalTo("type", request.params.type);
  const results = await query.find();
  let sum = 0;
  results.forEach(entry => {
    sum += entry.get("rating");
  });
  return sum / results.length;
});


Parse.Cloud.beforeSave("RatingEntry", (request) => {
  const entryName = request.object.get("name");
  const entryRating = request.object.get("rating");
  if (entryRating < 3) {
    request.object.set("name", entryName.concat(" ", "(!LOW RATING!)"));
  }
});
