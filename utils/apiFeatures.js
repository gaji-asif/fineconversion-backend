class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query = this.query.find({ ...keyword });
    return this;
  }
  filter() {
    const quearyCopy = { ...this.queryStr };
    // console.dir(quearyCopy);
    // Removing fields from the query
    const removeField = ["keyword", "limit", "page"];
    removeField.forEach((el) => delete quearyCopy[el]);

    // console.log(quearyCopy);

    //Advance filter for price, ratings etc
    let quearyStr = JSON.stringify(quearyCopy);
    quearyStr = quearyStr.replace(
      /\b(gt|gte|lt|lte)\b/g,
      match => `$${match}`,
    );
    // console.log(quearyStr);

    this.query = this.query.find(JSON.parse(quearyStr));
    return this;
  }

  pagination(resParPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resParPage * (currentPage - 1);
    
    this.query = this.query.limit(resParPage).skip(skip);
    return this;
  }
}
module.exports = APIFeatures;
