const { gql } = require('apollo-server');

type Product = {
  id: string,
  slug?: string,
  name: string,
  shortDescription?: string,
  longDescription?: string,
  categories?: Category[],
  variants: Variant[],
  raw: string
}

type Variant = {
  id: string,
  sku: string,
  prices: Prices,
  defaultImage?: Image,
  images: Image[]
}

type Image = {
  url: string
}

type Category = {
  id: string,
  name: string,
  slug: string,
  children: Category[],
  products: Product[],
  raw: string
}

type SearchResult = {
  products: Product[]
}

type Prices = {
  sale: number,
  list: number
}
 
module.exports.typeDefs = gql`
  scalar Raw

  type ProductResults {
    meta: ResultsMeta
    results: [Product]
  }

  type CategoryResults {
    meta: ResultsMeta
    results: [Category]
  }

  type ResultsMeta {
    limit: Int
    offset: Int
    count: Int
    total: Int
  }

  type Product {
    id: String!
    name: String!
    slug: String
    categories: [Category]
    shortDescription: String
    longDescription: String
    variants: [Variant!]
    raw: Raw!
  }

  type Category {
    id: String!
    name: String!
    slug: String
    children: [Category]
    products: [Product]
    raw: Raw!
  }

  type Prices {
    sale: Float
    list: Float
  }

  type Variant {
    id: String!
    sku: String!
    prices: Prices
    defaultImage: Image
    images: [Image!]
  }

  type Image {
    title: String
    alt: String
    url: String!
  }

  type SearchResult {
    products: [Product]
    currentFilters: [CurrentFilter]
    refinements: [Refinement]
    sortingOptions: [SortOption]
  }
  type SortOption {
      id: String!
      label: String!
  }
  type Refinement {
      attributeId: String!
      label: String!
      values: [RefinementValue]
  }
  type RefinementValue {
      label: String!
      value: String!
      hitCount: Int
      values: [RefinementValue]
  }
  type CurrentFilter {
      id: String
      value: String!
  }
  input Filter {
      id: String
      value: String!
  }

  type Query {
    products(keyword: String, limit: Int, offset: Int, locale: String): ProductResults
    product(id: String, sku: String, slug: String, locale: String): Product
    categories(limit: Int, offset: Int, locale: String): CategoryResults
    category(id: String, slug: String, locale: String): Category
  }
`;