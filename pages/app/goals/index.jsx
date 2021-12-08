import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import AppLayout from "../../../components/App/Layout/AppLayout";
import AppLoadingState from "../../../components/App/Utils/AppLoadingState";
import CreateGoal from "../../../components/App/Goals/CreateGoal";
import GoalsEmptyState from "../../../components/App/Goals/GoalsEmptyState";
import GoalsTable from "../../../components/App/Goals/GoalsTable";
import EditGoalSlideover from "../../../components/App/Goals/EditGoalSlideover";
import getGoals from "../../../helpers/getGoals";
import HasNoGoalsBanner from "../../../components/App/Goals/HasNoGoalsBanner";
import Header from "../../../components/App/Goals/Header";
import IntroCard from "../../../components/App/Goals/IntroCard";
import getContacts from "../../../helpers/getContacts";

export default function Index() {
  const [loading, setLoading] = useState(true)
  const [displayFormType, setDisplayFormType] = useState('empty')
  const [goals, setGoals] = useState()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState()
  const [selectedGoal, setSelectedGoal] = useState()
  const [numOfCols, setNumOfCols] = useState(4)
  const [contacts, setContacts] = useState()

  async function getUserGoals() {
    const user = await supabase.auth.user()
    setUser(user)
    const id = user['id']
    getGoals(id, setGoals)
  }

  async function getUserContacts() {
    const user = await supabase.auth.user()
    const id = user['id']
    getContacts(id, setContacts)
  }

  useEffect(() => {
    getUserGoals()
  }, [])

  useEffect(() => {
    getUserContacts()
  }, [])

  useEffect(() => {
    if (goals) {
      setNumOfCols(goals.length <= 4 ? goals.length : 4)
      user && setLoading(false)
      goals.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0))
    }
  }, [goals])

  if (loading) {
    return (<AppLoadingState />)
  } else {
    return (
      <AppLayout>
        <Header setDisplayFormType={setDisplayFormType} goals={goals} contacts={contacts} />
        {!goals || goals.length === 0 && <HasNoGoalsBanner />}
        <IntroCard />
        {displayFormType === 'empty' && !goals && <GoalsEmptyState setState={setDisplayFormType} />}
        {displayFormType === 'create' && <CreateGoal setDisplayFormType={setDisplayFormType} getUserGoals={getUserGoals} />}
        {goals && goals.length > 0 && <GoalsTable goals={goals} setSelectedGoal={setSelectedGoal} setOpen={setOpen} />}
        <EditGoalSlideover title="Edit goal" open={open} setOpen={setOpen} user={user} selectedGoal={selectedGoal} getUserGoals={getUserGoals} />
      </AppLayout>
    )
  }
}