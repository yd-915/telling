import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import GridCard from "../../Global/GridCard";

export default function GoalCard({ goal }) {
  const [isUrgent, setIsUrgent] = useState()
  const router = useRouter()

  // set goal as urgent if due in the next 24 hours
  useEffect(() => {
    const dayInUnixTime = 86400
    const unixDueDate = new Date(goal['due_date']).getTime() / 1000
    const timeLeft = unixDueDate - dayInUnixTime
    const dateNow = Date.now().toString().slice(0, -3)
    timeLeft <= dateNow && setIsUrgent(true)
  }, [goal])


  return (
    <div onClick={() => {
      router.push({
        pathname: '/app/goals/[id]',
        query: { id: goal.id },
      })
    }}>
    <GridCard>
      <h2 className="font-extrabold text-gray-900 text-lg mb-2 truncate">{goal.title}</h2>
      <p className="text-sm h-10 overflow-hidden mb-4">
        {goal.description}
      </p>
      <p>
        {goal['is_completed'] === false &&
          <>
            <span className="text-gray-400">Due by: </span>
            <span className={isUrgent ? 'text-red-500' : 'text-gray-500'}>{goal['due_date']}</span>
          </>
        }
        {goal['is_completed'] === true &&
          <>
            <span className="text-gray-400">Completed</span>
            {goal['is_completed_on_time'] === false && <span className="text-red-400"> late</span>}
          </>
        }
      </p>
    </GridCard>
    </div>
  )
}