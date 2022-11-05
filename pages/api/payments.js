import { collection, query, where, getDocs } from "firebase/firestore";

export async function handler(req, res) {
    const {includefields, omitfields, propertyid} = req.headers

    let includeFieldsArray = []
    let omitFieldsArray = []
    let propertyIDArray = []


    if(typeof includefields != "undefined")  propertyIDArray = propertyid.split(',')
    if(typeof omitfields != "undefined") omitFieldsArray = omitfields.split(',')
    if(typeof propertyid != "undefined") propertyIDArray = includefields.split(',')

    res.status(200).json(22)
}