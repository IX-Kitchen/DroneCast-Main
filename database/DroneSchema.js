'use strict';

module.exports = {
    $jsonSchema: {
        title: "DroneSchema",
        description: "A drone description",
        bsonType: "object",
        required: ["name"],
        properties: {
            name: {
                bsonType: "string",
                description: "Drone name"
            },
            onair: {
                bsonType: "bool",
                description: "Is the drone on air?"
            }
        }
    }
}