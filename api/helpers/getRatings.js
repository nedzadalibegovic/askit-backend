const getRatings = (query, FilterID) => {
  query.withGraphFetched("ratings").modifyGraph("ratings", (builder) => {
    builder.where("UserID", FilterID);
  });
};

module.exports = getRatings;
