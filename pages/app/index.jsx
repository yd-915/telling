import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import AppLayout from "../../components/App/Layout/AppLayout";
import Button from "../../components/Global/Button";
import CardTitle from "../../components/Global/CardTitle";
import GoalCard from "../../components/App/Dashboard/GoalCard";
import StatsSection from "../../components/Web/StatsSection";
import LoadingWheelWrapper from "../../components/Global/LoadingWheelWrapper";
import LoadingWheel from "../../components/Global/LoadingWheel";
import getGoals from "../../helpers/getGoals";
import getTattleStats from "../../helpers/getTattleStats";

export default function Index() {
  const [loading, setLoading] = useState(true)
  const [goals, setGoals] = useState()
  const [numberOfGoalsToShow, setNumberOfGoalsToShow] = useState(4)
  const [userStats, setUserStats] = useState({
    'statOne': '0',
    'statOneText': 'Goals created',
    'statTwo': '0',
    'statTwoText': 'Completed on time',
    'statThree': '0',
    'statThreeText': 'times Tattled on',
  })
  const [numOfCols, setNumOfCols] = useState(4)
  const [incompleteGoals, setIncompleteGoals] = useState()

  useEffect(() => {
    async function getGoalsAndStats() {
      const user = await supabase.auth.user()
      const id = user['id']
      getGoals(id, setGoals)
      getTattleStats(id, setUserStats)
    }
    getGoalsAndStats()
  }, [])

  useEffect(() => {
    if (goals) {
      setUserStats({
        'statOne': goals.length,
        'statOneText': 'Goals created',
        'statTwo': '2',
        'statTwoText': 'Goals completed on time',
        'statThree': '1',
        'statThreeText': 'times Tattled on',
        'statFourText':'Goals due this week',
        'statFour':'1'
      })
      setUserStats(prev => ({ ...prev, statOne: goals.length }))
      let goalsCompletedOnTime = 0
      for (const goal of goals) {
        goal['is_completed_on_time'] === true && goalsCompletedOnTime++
      }
      setUserStats(prev => ({ ...prev, statTwo: goalsCompletedOnTime }))
    }
  }, [goals])

  useEffect(() => {
    if (goals) {
      const outstandingGoals = goals.filter(item => item['is_completed'] === false)
      setNumOfCols(outstandingGoals.length <= 3 ? outstandingGoals.length + 1 : 4)
      // Sort goals by due_date, then by id
      outstandingGoals.sort(
        function(a, b) {
          if (a['due_date'] > b['due_date']) {
            return -1
          } else if (a['due_date'] < b['due_date']) {
            return 1
          }
          if (a['id'] > b['id']) {
            return -1
          } else if (a['id'] < b['id']) {
            return 1
          }
        }
      ).reverse()
      setIncompleteGoals(outstandingGoals)
      userStats && setLoading(false)
    }
  }, [userStats, goals])

  return (
    <AppLayout>
      {loading && (
        <LoadingWheelWrapper>
          <LoadingWheel />
        </LoadingWheelWrapper>
      )}
      {!loading && (
        <>
          <StatsSection statProps={userStats} showHeadings={false} />
          <CardTitle>Goals due soon</CardTitle>
          <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-${numOfCols} gap-5`}>
            {incompleteGoals && incompleteGoals.map((goal, index) => {
              if (index < numberOfGoalsToShow) {
                return (
                  <article key={index}>
                    <GoalCard goal={goal} />
                  </article>
                )
              }
            })}
          </div>
          <div className="w-36 mx-auto mt-10">
            {
              incompleteGoals && incompleteGoals.length > 3 &&
                <Button disabled={numberOfGoalsToShow > incompleteGoals.length} onClickHandler={() => setNumberOfGoalsToShow(numberOfGoalsToShow + 4)}>
                  Show more
                </Button>
            }
          </div>
        </>
      )}
    </AppLayout>
  )
}