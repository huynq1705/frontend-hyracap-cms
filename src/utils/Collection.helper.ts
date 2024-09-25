

export default class CollectionHelper {

    static DEFAULT_COLLECTION = {
        "enable": true,
        "collection_name": "ekyc_history",
        "uuid_field_name": "session-id",
        "action": 1,
        "face_search": {
            "selfie": {
                "enable": true,
                "top_k": 7,
                "metric": "cosin",
                "threshold": 0.5
            },
            "document": {
                "enable": true,
                "top_k": 7,
                "metric": "cosin",
                "threshold": 0.5
            }
        },
        // "condition_to_create_new_profile": [
        //     {
        //         "type": "manual"
        //     }
        // ]
    }
}