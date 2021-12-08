import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabaseClient";
import AppLayout from "../../../components/App/Layout/AppLayout";
import AppLoadingState from "../../../components/App/Utils/AppLoadingState";
import Banner from "../../../components/App/Banner";
import ContactsEmptyState from "../../../components/App/Contacts/ContactsEmptyState";
import CreateGoal from "../../../components/App/Goals/CreateGoal";
import GoalsEmptyState from "../../../components/App/Goals/GoalsEmptyState";
import getGoals from "../../../helpers/getGoals";
import getContacts from "../../../helpers/getContacts";
import CardTitle from "../../../components/Global/CardTitle";

export default function New() {
  const [displayFormType, setDisplayFormType] = useState('empty')
  const [goals, setGoals] = useState()
  const [user, setUser] = useState()
  const [loading, setLoading] = useState(true)
  const [contacts, setContacts] = useState()
  const [contactFormState, setContactFormState] = useState()
  const router = useRouter()

  async function getUserGoals() {
    const user = await supabase.auth.user()
    setUser(user)
    const id = user['id']
    getGoals(id, setGoals)
  }

  useEffect(() => {
    getUserGoals()
  }, [])

  useEffect(() => {
    user && getContacts(user.id, setContacts)
  }, [user])

  useEffect(() => {
    goals && setLoading(false)
  }, [goals])

  useEffect(() => {
    if (contactFormState === 'create') {
      router.push('/app/contacts/new')
    }
  }, [contactFormState])

  if (loading) {
    return (<AppLoadingState />)
  } else {
    return (
      <AppLayout>
        <CardTitle>Create a goal</CardTitle>
        {!contacts && !goals || contacts && contacts.length >= 1 && goals && goals.length === 0 && <GoalsEmptyState setState={setDisplayFormType} />}
        {!goals || goals && goals.length > 0 && <CreateGoal getUserGoals={getUserGoals} />}
        {!contacts || contacts && contacts.length === 0 && (
          <>
            <Banner>
              <p className="mb-6">You need to add a contact before you can create a goal.</p>
            </Banner>
            <ContactsEmptyState setState={setContactFormState} />
          </>
        )}
      </AppLayout>
    )
  }
}