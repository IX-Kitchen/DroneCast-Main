'use strict';

module.exports = {
    $jsonSchema: {
        title: "PhotoSchema",
        description: "A photo object",
        bsonType: "object",
        required: ["name", "date", "author", "scenario"],
        properties: {
            name: {
                bsonType: "string",
                description: "File name. must be a string and is not required"
            },
            date: {
                bsonType: "date",
                description: "Date of uploading"
            },
            author: {
                bsonType: "string",
                description: "Uploader"
            },
            scenario: {
                bsonType: "string",
                description: "Scenario of the photo"
            },
            category: {
                bsonType: "string",
                description: "Sorting"
            }
        }
    }
}