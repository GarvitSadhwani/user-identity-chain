const {getContactAndEmail,insertContact,updateContact,getContactById,getSecondaryContacts} = require('./DbUtils');

async function handleContact(req,res){
    let finalData={
        contact: {
            primaryContactId: null,
            emails: [],
            phoneNumbers: [],
            secondaryContactIds: []
        }
    };
    const contact=req.body.phoneNumber;
    const email=req.body.email;
    console.log("email: ",email," contact: ",contact);
    if(email==null && contact==null){
        res.status(200);
        res.send(finalData);
        return;
    }

    let rawData=await getContactAndEmail(contact,email);
    console.log("raw dataL: ",rawData);
    if(rawData.length==0){
        let insertRes=await insertNewContact(contact,email,null,"primary");
        finalData={
            contact: {
                primaryContactId: insertRes.id,
                emails: [insertRes.email],
                phoneNumbers: [insertRes.phonenumber],
                secondaryContactIds: []
            }
        };

        res.status(200);
        res.send(finalData);
    }
    else{
        let primaryContact = rawData.find(row => row.linkprecedence === 'primary') || rawData[0];

        if(primaryContact.linkedid !== null){
            primaryContact= await getContactById(primaryContact.linkedid);
        }

        let secondaryContacts = await getSecondaryContacts(primaryContact.id);

        let isDifferent = !rawData.some(row => (row.email === email && row.phonenumber === contact));

        if(isDifferent && email !== null && contact !== null){
            let insertRes=await insertNewContact(contact,email,primaryContact.id,"secondary");
            secondaryContacts.push(insertRes);
        }

        for(let contact of rawData){
            if(contact.linkprecedence==='primary' && contact.id !== primaryContact.id){
                let res=await updatePrimaryContact(contact.id,primaryContact.id);
                secondaryContacts.push(contact);
            }
        }

        let secondaryEmails=secondaryContacts.map((contact) => {if(contact.email !== primaryContact.email) return contact.email}).filter(e => e);
        secondaryEmails=[...new Set(secondaryEmails)];

        let secondaryPhones=secondaryContacts.map((contact) => {if(contact.phonenumber !== primaryContact.phonenumber) return contact.phonenumber}).filter(e => e);
        secondaryPhones=[...new Set(secondaryPhones)];

        finalData={
            contact: {
                primaryContactId: primaryContact.id,
                emails: [primaryContact.email, ...secondaryEmails],
                phoneNumbers: [primaryContact.phonenumber, ...secondaryPhones],
                secondaryContactIds: secondaryContacts.map(contact => contact.id)
            }
        };

        res.status(200);
        res.send(finalData);
    }
}

async function insertNewContact(contact,email,linkedid,linkprecedence){
    let insertRes=await insertContact(contact,email,linkedid,linkprecedence);
    return insertRes;
}

async function updatePrimaryContact(id,linkedid){
    let updateRes=await updateContact(id,linkedid);
    return updateRes;
}


module.exports={
    handleContact
}