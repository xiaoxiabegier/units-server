import { collection, query, where, getDocs } from "firebase/firestore";
import {db} from "../../public/firebase";


export default async function handler(req, res) {
    const {includefields, omitfields, propertyid} = req.headers

    let includeFieldsArray = []
    let omitFieldsArray = []
    let propertyIDArray = []


    if(typeof includefields != "undefined")  includeFieldsArray = includefields.split(',')
    if(typeof omitfields != "undefined") omitFieldsArray = omitfields.split(',')
    if(typeof propertyid != "undefined") propertyIDArray = propertyid.split(',')



    if (propertyIDArray.length !== 0) {
        const paymentsCol = query(collection(db, "payments"), where("propertyID", "in", propertyIDArray));
    }
    else{
        const paymentsCol = collection(db, "payments");

    }

    const unpaidCol = query(collection(db, "payments"), where("status", "==", "unpaid"));
    const processingCol = query(collection(db, "payments"), where("status", "==", "processing"));
    const paidCol = query(collection(db, "payments"), where("paid", "==", true));


    const unpaidSnapshot = await getDocs(unpaidCol);
    const processingSnapshot = await getDocs(processingCol);
    const paidSnapshot = await getDocs(paidCol);


        let payments = {}

        let unpaid = {}
        unpaidSnapshot.forEach((doc) => {
            unpaid[doc.id] = getFields(doc, includeFieldsArray,  omitFieldsArray)
        });
        payments["unpaid"] = unpaid

        let processing = {}
        processingSnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            processing[doc.id] = getFields(doc, includeFieldsArray,  omitFieldsArray)
        });
        payments["processing"] = processing

        let paid = {}
        paidSnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            paid[doc.id] = getFields(doc, includeFieldsArray,  omitFieldsArray)
        });
        payments["paid"] = paid

    res.status(200).json(payments)

}


export function getFields(doc, includeFieldsArray,  omitFieldsArray) {
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
