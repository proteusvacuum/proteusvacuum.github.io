---
layout: post
title:  "Indexing multiple datatypes in Elasticsearch using multi-fields"
date:   2018-05-07
tag: code
---

In a lot of datasets created by users, consistent types aren't always guaranteed. This can become a problem when trying to add this data to elasticsearch (or other data stores where types are important), as ES can only index one data type per field, as defined in your index mapping. 

The solution that I've used is to index fields with different potential datatypes using a multi-field mapping along with the `ignore_malformed` [parameter](https://www.elastic.co/guide/en/elasticsearch/reference/current/ignore-malformed.html) set to `true`. 

This will allow elasticsearch to populate the fields that are pertinent for each user input, and ignore the others. It also means you don't need to do anything in your indexing code to deal with the different types.

For example, for a field called `user_input` that you want to be able to do date or integer range queries over if that is what the user has entered, or a regular text search if the user has entered a string, you could do something like the following:

```
PUT multiple_datatypes
{
  "mappings": {
    "_doc": {
      "properties": {
        "user_input": {
          "type": "text",
          "fields": {
            "numeric": {
              "type": "double",
              "ignore_malformed": true
            },
            "date": {
              "type": "date",
              "ignore_malformed": true
            }
          }
        }
      }
    }
  }
}

```

We can then add a few documents with different user inputs:


```
PUT multiple_datatypes/_doc/1
{
  "user_input": "hello"
}

PUT multiple_datatypes/_doc/2
{
  "user_input": "2017-02-12"
}

PUT multiple_datatypes/_doc/3
{
  "user_input": 5
}
```

And search for these, and have ranges and other type-specific queries work as expected:

```
// Returns only document 2
GET multiple_datatypes/_search
{
  "query": {
    "range": {
      "user_input.date": {
        "gte": "2017-01-01"
      }
    }
  }
}

// Returns only document 3
GET multiple_datatypes/_search
{
  "query": {
    "range": {
      "user_input.numeric": {
        "lte": 9
      }
    }
  }
}

// Returns only document 1
GET multiple_datatypes/_search
{
  "query": {
    "term": {
      "user_input": {
        "value": "hello"
      }
    }
  }
}
```

Hopefully this is helpful!
