import firebase_admin
from firebase_admin import credentials


def main():
    cred = credentials.Certificate("fca6beae91d5639043f6f8a0c186b93d91781006")
    firebase_admin.initialize_app(cred)

    doc_ref = db.collection(u'users').document(u'alovelace')
    doc_ref.set({
        u'first': u'Ada',
        u'last': u'Lovelace',
        u'born': 1815
    })

    print("done")



if __name__ == "__main__":
    main()