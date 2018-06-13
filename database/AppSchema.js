'use strict';

module.exports = {
    $jsonSchema: {
        title: "AppSchema",
        description: "An app description",
        bsonType: "object",
        required: ["name", "date", "author", "scenario", "appdata"],
        properties: {
            name: {
                bsonType: "string",
                description: "App name"
            },
            date: {
                bsonType: "date",
                description: "Date of uploading"
            },
            displays: {
                bsonType: "array",
                description: "Displays bound to the app"
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
            },
            appdata: {
                bsonType: "object",
                description: "App Data"
            }
        }
    }
}