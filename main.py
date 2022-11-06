import firebase

import firebase_admin
from firebase_admin import firestore

# Application Default credentials are automatically created.
app = firebase_admin.initialize_app()
db = firestore.client()
db.collection("units/36 Castro St/payments").document("example").set({name: "name"})