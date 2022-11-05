import { collection, getDocs , doc, getDoc} from "firebase/firestore";
import {db} from "../../public/firebase";
export default async function handler(req, res){

    if(req.method === "POST") {
        res.status(200).json("POST ME IF YOU CAN!")

    }
    if(req.method === "PUT") {
        res.status(200).json("PUT ME IF YOU CAN!")
    }
    const {includefields, omitfields, propertyid} = req.headers

    let propertyIDArray = []
    let omitFieldsArray = []
    let includeFieldsArray = []

    if(typeof propertyid != "undefined")  propertyIDArray = propertyid.split(',')
    if(typeof omitfields != "undefined") omitFieldsArray = omitfields.split(',')
    if(typeof includefields != "undefined") includeFieldsArray = includefields.split(',')

    let returnObj = await getAppropriateDocs(propertyIDArray, includeFieldsArray,omitFieldsArray )

    res.status(200).json(returnObj)

}

async function getFields(doc, includeFieldsArray,  omitFieldsArray) {


    let returnObj = {}

    if (includeFieldsArray.length !== 0) {
        // GET SPECIFIED FIELDS
        for(let elem in includeFieldsArray) {
            returnObj[includeFieldsArray[elem]] = doc.get(includeFieldsArray[elem])
        }
    } else {
        returnObj = doc.data()
    }

    for(let elem in omitFieldsArray){
        delete returnObj[omitFieldsArray[elem]]
    }

    return returnObj
}

async function getAppropriateDocs(propertyIDArray, includeFieldsArray, omitFieldsArray){
    let data = {}

    if(propertyIDArray.length === 0) {
        // GET ALL DOCS IN /UNITS
        const querySnapshot = await getDocs(collection(db, "units"));
        querySnapshot.forEach(async (doc) => {
            data[doc.id] = await getFields(doc, includeFieldsArray, omitFieldsArray)
        });
    } else {
        // GET SPECIFIED DOCS
        for(let propertyID in propertyIDArray) {
            const docRef = doc(db, "units", propertyIDArray[propertyID]);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()){
                data[docSnap.id] = await getFields(docSnap, includeFieldsArray, omitFieldsArray)
}
        }
        }
    return data
}