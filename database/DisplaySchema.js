'use strict';

module.exports = {
    $jsonSchema: {
        title: "DisplaySchema",
        description: "A display description",
        bsonType: "object",
        required: ["name"],
        properties: {
            name: {
                bsonType: "string",
                description: "Display name"
            },
            onair: {
                bsonType: "bool",
                description: "Is the display on air?"
            }
        }
    }
}