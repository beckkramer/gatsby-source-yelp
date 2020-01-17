const fetch = require("node-fetch");

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest, reporter },
  configOptions
) => {
  const { createNode } = actions;
  const { apiKey, id } = configOptions;
  const apiURL = "https://api.yelp.com/v3";

  if (!apiKey) {
    reporter.info(`apiKey is required`);
    return;
  }

  if (!id) {
    reporter.info(`please provide id on gatsby-source-yelp plugin options`);
    return;
  }

  // Gatsby adds a configOption that's not needed for this plugin, delete it
  delete configOptions.plugins;

  // Helper function that processes a data to match Gatsby's node structure
  const processData = (data, type) => {
    const nodeId = createNodeId(data.id);
    const nodeContent = JSON.stringify(data);
    const nodeData = Object.assign({}, data, {
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: type,
        content: nodeContent,
        contentDigest: createContentDigest(data)
      }
    });
    return nodeData;
  };

  // Request options
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    redirect: "follow"
  };

  // Fetch a response from api business reviews
  const getBusinessReviews = await fetch(
    `${apiURL}/businesses/${id}/reviews`,
    requestOptions
  )
    // Parse the response as JSON
    .then(response => response.json())
    // Process the JSON data into a node
    .then(data => {
      // For each query result
      data.reviews.forEach(review => {
        const nodeData = processData(review, "YelpBusinessReview");
        // Use Gatsby's createNode helper to create a node from the node data
        createNode(nodeData);
      });
    });

  // Fetch a response from api business details
  const getBusinessDetails = await fetch(
    `${apiURL}/businesses/${id}`,
    requestOptions
  )
    .then(response => response.json())
    .then(data => {
      const nodeData = processData(data, "YelpBusinessDetails");
      createNode(nodeData);
    });

  // Gatsby expects sourceNodes to return a Promise
  return Promise.all([getBusinessReviews, getBusinessDetails]);
};
