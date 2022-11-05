import { collection, getDocs , doc, getDoc} from "firebase/firestore";
import {db} from "../../public/firebase";
export default async function handler(req, res){

    if(req.method === "POST") {
        res.status(200).json("POST ME IF YOU CAN!")

    }
    if(req.method === "PUT") {
        res.status(200).json("PUT ME IF YOU CAN!")
    }
    const {includefields, omitfields, propertyid, includepayments} = req.headers

    let propertyIDArray = []
    let omitFieldsArray = []
    let includeFieldsArray = []
    let includePayments = false


    if(typeof propertyid != "undefined")  propertyIDArray = propertyid.split(',')
    if(typeof omitfields != "undefined") omitFieldsArray = omitfields.split(',')
    if(typeof includefields != "undefined") includeFieldsArray = includefields.split(',')
    if(typeof includepayments != "undefined") includePayments = true


    let returnObj = await getAppropriateDocs(propertyIDArray, includeFieldsArray,omitFieldsArray, includePayments )

    res.status(200).json(returnObj)

}

async function getFields(doc, includeFieldsArray,  omitFieldsArray, includePayments) {


    let returnObj = {}

    if (includeFieldsArray.length !== 0) {
        // GET SPECIFIED FIELDS
        for(let elem in includeFieldsArray) {
            returnObj[includeFieldsArray[elem]] = doc.get(includeFieldsArray[elem])
        }
    } else {
        returnObj = doc.data()
    }

    // add payments to obj
    if (includePayments) {
        const querySnapshot = await getDocs(collection(db, "units/"+doc.id+"/payments"));
        let payments = {}
        querySnapshot.forEach((paymentDoc) => {
            payments[paymentDoc.id] = paymentDoc.data()
        });
        returnObj["payments"] = payments
    }



    for(let elem in omitFieldsArray){
        delete returnObj[omitFieldsArray[elem]]
    }

    return returnObj
}

async function getAppropriateDocs(propertyIDArray, includeFieldsArray, omitFieldsArray, includePayments){
    let data = {}

    if(propertyIDArray.length === 0) {
        // GET ALL DOCS IN /UNITS
        const querySnapshot = await getDocs(collection(db, "units"));
        querySnapshot.forEach(async (doc) => {
            data[doc.id] = await getFields(doc, includeFieldsArray, omitFieldsArray, includePayments)
        });
    } else {
        // GET SPECIFIED DOCS
        for(let propertyID in propertyIDArray) {
            const docRef = doc(db, "units", propertyIDArray[propertyID]);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()){
                data[docSnap.id] = await getFields(docSnap, includeFieldsArray, omitFieldsArray, includePayments)
}
        }
        }
    return data
}