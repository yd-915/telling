import AppLayout from "../../components/App/Layout/AppLayout";
import Card from "../../components/Global/Card";
import CardTitle from "../../components/Global/CardTitle";
import Button from "../../components/Global/Button";
import ContactsEmptyState from "../../components/App/Contacts/ContactsEmptyState";
import {useEffect, useState} from "react";
import CreateContact from "../../components/App/Contacts/CreateContact";
import {supabase} from "../../lib/supabaseClient";
import getContacts from "../../helpers/getContacts";
import ContactsTable from "../../components/App/Contacts/ContactsTable";

export default function Contacts() {
  const [displayFormType, setDisplayFormType] = useState('empty')
  const [contacts, setContacts] = useState()
  const [user, setUser] = useState()

  useEffect(() => {
    setUser(supabase.auth.user())
  }, [])

  async function getUser() {
    const user = await supabase.auth.user()
    const id = user['id']
    getContacts({ id, setContacts })
  }

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    console.log("Contacts!: ", contacts)
  }, [contacts])

  return (
    <AppLayout>
      <div className="flex justify-between">
        <CardTitle>Contacts</CardTitle>
        <div className="max-w-min">
          <Button onClickHandler={() => setDisplayFormType('create')}>Create</Button>
        </div>
      </div>
      <Card>
        <CardTitle>Manage your contacts</CardTitle>
        <p>Before you can create a goal, you need to create a contact. Contacts are the phone numbers that Tattle messages when you don't achieve your goal.</p>
        <p className="my-4">Add your mom, your best friend, or anyone else that will help keep you accountable.</p>
        <p>After saving a contact, you can assign the contact to any goals you create.</p>
      </Card>
      {displayFormType === 'empty' && !contacts && <ContactsEmptyState setState={setDisplayFormType} />}
      {displayFormType === 'create' && <CreateContact user={user} />}
      {contacts && <ContactsTable contacts={contacts} /> }
    </AppLayout>
  )
}