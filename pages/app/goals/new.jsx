import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../../lib/supabaseClient";
import AppLayout from "../../../components/App/Layout/AppLayout";
import AppLoadingState from "../../../components/App/Utils/AppLoadingState";
import Banner from "../../../components/App/Utils/Banner";
import CardTitle from "../../../components/Global/CardTitle";
import ContactsEmptyState from "../../../components/App/Contacts/ContactsEmptyState";
import CreateGoal from "../../../components/App/Goals/CreateGoal";
import GoalsEmptyState from "../../../components/App/Goals/GoalsEmptyState";
import StateWrapper from "../../../components/App/Layout/StateWrapper";
import getGoals from "../../../helpers/goals/getGoals";
import getContacts from "../../../helpers/contacts/getContacts";

export default function New() {
  const [displayFormType, setDisplayFormType] = useState('empty')
  const [goals, setGoals] = useState([])
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(true)
  const [contacts, setContacts] = useState([])
  const [contactFormState, setContactFormState] = useState('')
  const router = useRouter()

  async function getUserGoals() {
    const authUser = await supabase.auth.user()
    if (authUser?.id) {
      const id = authUser['id']
      getGoals(id, setGoals)
      setUser(authUser)
    }
  }

  useEffect(() => {
    getUserGoals()
  }, [])

  useEffect(() => {
    user && getContacts(user.id, setContacts)
  }, [user])

  useEffect(() => {
    goals && setTimeout(() => {
      setLoading(false)
    }, 100)
  }, [goals])

  useEffect(() => {
    if (contactFormState === 'create') {
      router.push('/app/contacts/new')
    }
  }, [contactFormState])

    return (
      <AppLayout>
        {loading ? <AppLoadingState /> : (
          <StateWrapper>
            <CardTitle>Create a goal</CardTitle>
            {!contacts && !goals || contacts?.length >= 1 && goals?.length === 0 && <GoalsEmptyState setState={setDisplayFormType} />}
            {!goals || goals?.length > 0 && <CreateGoal getUserGoals={getUserGoals} setDisplayFormType={setDisplayFormType} />}
            {!contacts || contacts?.length === 0 && (
              <>
                <Banner>
                  <p className="mb-6">You need to add a contact before you can create a goal.</p>
                </Banner>
                <ContactsEmptyState setState={setContactFormState} />
              </>
            )}
          </StateWrapper>
        )}
      </AppLayout>
    )
}