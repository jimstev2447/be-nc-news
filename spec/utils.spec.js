const { expect } = require("chai");
const { articleData } = require("../db/data/test-data");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("returns an object", () => {
    expect(formatDates()).to.be.an("array");
  });
  it("returns with the created_at key to be an instance of JS date obj", () => {
    const testArt = [
      {
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: 1542284514171,
        votes: 100
      }
    ];
    const formattedData = formatDates(testArt);
    expect(formattedData[0].created_at).to.be.instanceof(Date);
  });
  it("should not mutate the original array", () => {
    const testArticle = articleData.map(art => {
      return { ...art };
    });
    const expectedData = articleData.map(art => {
      return { ...art };
    });
    formatDates(testArticle);
    expect(testArticle).to.eql(expectedData);
  });
});
describe("makeRefObj", () => {
  it("takes an array and returns an object", () => {
    expect(makeRefObj([])).to.be.an("object");
  });
  it("given an array with one item returns an obj with KV pairs of title : article_id", () => {
    const testArr = [{ article_id: 1, title: "test" }];

    expect(makeRefObj(testArr)).to.eql({ test: 1 });
  });
  it("given a larger arr returns correctly", () => {
    const testArr = [
      { article_id: 1, title: "test-1" },
      { article_id: 2, title: "test-2" },
      { article_id: 3, title: "test-3" }
    ];
    expect(makeRefObj(testArr)).to.eql({
      "test-1": 1,
      "test-2": 2,
      "test-3": 3
    });
  });
  it("does not mutate the original array", () => {
    const testArr = [
      { article_id: 1, title: "test-1", one: 1 },
      { article_id: 2, title: "test-2", two: 2 },
      { article_id: 3, title: "test-3", three: 3 }
    ];
    makeRefObj(testArr);
    expect(testArr).to.eql([
      { article_id: 1, title: "test-1", one: 1 },
      { article_id: 2, title: "test-2", two: 2 },
      { article_id: 3, title: "test-3", three: 3 }
    ]);
  });
});
describe("formatComments", () => {
  const testArt = [
    { created_by: "john", belongs_to: "test", created_at: 1511354163389 }
  ];
  const lookup = { test: 1 };

  it("returns an array", () => {
    expect(formatComments()).to.be.an("array");
  });
  it("returns with author key added to each obj in the arr.", () => {
    expect(formatComments(testArt, lookup)[0]).to.include.key("author");
  });
  it("returns with the author key equal to the original objects created_by value", () => {
    const newArr = formatComments(testArt, lookup);
    expect(newArr[0].author).to.equal("john");
  });
  it("returns without the created by property", () => {
    const newArr = formatComments(testArt, lookup);
    expect(newArr[0]).to.not.include.key("created_by");
  });
  it("adds an article_id property", () => {
    expect(formatComments(testArt, lookup)[0]).to.include.key("article_id");
  });
  it("article id matches the appropriate value in the lookup table based on the belongs_to property", () => {
    expect(formatComments(testArt, lookup)[0].article_id).to.equal(1);
  });
  it("removes belongs to property", () => {
    expect(formatComments(testArt, lookup)[0]).to.not.include.keys(
      "belongs_to"
    );
  });
  it("the returned article objects created_at value should be an instance of a javascript Date", () => {
    expect(formatComments(testArt, lookup)[0].created_at).to.be.instanceof(
      Date
    );
  });

  it("does not mutate the original array", () => {
    const testArts = [
      { created_by: "test-a", belongs_to: "test-a", created_at: 1542284514171 },
      { created_by: "test-b", belongs_to: "test-b", created_at: 1542284514171 },
      { created_by: "test-c", belongs_to: "test-c", created_at: 1542284514171 },
      { created_by: "test-d", belongs_to: "test-d", created_at: 1542284514171 },
      { created_by: "test-e", belongs_to: "test-e", created_at: 1542284514171 }
    ];
    const testlookup = {
      "test-a": 1,
      "test-b": 2,
      "test-c": 3,
      "test-d": 4,
      "test-e": 5
    };
    formatComments(testArts, testlookup);
    expect(testArts).to.eql([
      { created_by: "test-a", belongs_to: "test-a", created_at: 1542284514171 },
      { created_by: "test-b", belongs_to: "test-b", created_at: 1542284514171 },
      { created_by: "test-c", belongs_to: "test-c", created_at: 1542284514171 },
      { created_by: "test-d", belongs_to: "test-d", created_at: 1542284514171 },
      { created_by: "test-e", belongs_to: "test-e", created_at: 1542284514171 }
    ]);
  });
});
