# Gatsby Source for Yelp

Source plugin for fetching data into [Gatsby](https://www.gatsbyjs.org) from [Yelp](https://www.yelp.com/developers/documentation/v3) REST API to your Gatsby website.

## Install

```
npm install --save @leomanlapera/gatsby-source-yelp
yarn add @leomanlapera/gatsby-source-yelp
```

## How to use

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `@leomanlapera/gatsby-source-yelp`,
    options: {
      id: <business-id>,
      apiKey: <yelp-api-key>
    }
  },
]
```

## How to query

You can query the nodes created from Yelp with the following:

```graphql
{
  allYelpBusinessReview {
    edges {
      node {
        id
        rating
        text
        time_created
        url
        user {
          name
        }
      }
    }
  }
}
```

and you can filter specific node using this:

```graphql
{
  yelpBusinessReview(id: {eq: ""}) {
    id
    rating
    text
    url
  }
}
```

## Currently supporting

- Business Reviews
- Business Details
