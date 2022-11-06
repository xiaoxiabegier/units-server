import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import {db} from "../../public/firebase";
import {getFields} from "./payments";


export default async function handler(req, res) {
    const {includefields, omitfields, propertyid} = req.headers

    let includeFieldsArray = []
    let omitFieldsArray = []
    let propertyIDArray = []



    if(typeof includefields != "undefined")  includeFieldsArray = includefields.split(',')
    if(typeof omitfields != "undefined") omitFieldsArray = omitfields.split(',')
    if(typeof propertyid != "undefined") propertyIDArray = propertyid.split(',')



    let colRef = collection(db, "payments")

    if(propertyIDArray.length !== 0){
        colRef =query(colRef, where("propertyID", "in", propertyIDArray), orderBy("timestamps.dateAdded"))
    } else {
        colRef = query(colRef, orderBy("timestamps.dateAdded"))
    }

    const paymentSnapshot = await getDocs(colRef)

    let returnObj = {}
    let lastPropertyID = null
    let lastStatus = null

    let currentPropertyID = null
    let currentStatus = null

    paymentSnapshot.docs.forEach(doc => {
        console.log(doc.get("propertyID") in returnObj)
        if (!(doc.get("propertyID") in returnObj)) {
            returnObj[doc.get("propertyID")] = {unpaid: {}, processing: {}, paid: {}}
        }
        returnObj[doc.get("propertyID")][doc.get("status")][doc.id] = getFields(doc, includeFieldsArray,  omitFieldsArray)
    })

    res.status(200).json(returnObj)

}