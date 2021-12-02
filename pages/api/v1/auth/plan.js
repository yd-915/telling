import {supabase} from "../../../../lib/supabaseClient";

async function checkUserPlan(req, res) {
  const { ownerId } = req.query
  try {
    const { data, error, status } = await supabase
      .from('profiles')
      .select('is_subscribed')
      .eq('id', ownerId)
    if (data) {
      res.status(status).json(data)
    }
    if (error) {
      res.status(status).json(error)
    }
  } catch (err) {
    res.json(err)
  } finally {
    res.end()
  }
}

export default function handler(req, res) {
  if (req.method === 'POST') {
    // handle post
  } else if (req.method === 'GET') {
    return checkUserPlan(req, res)
  } else {
    res.send("Something's not right. Check your query.").end()
  }
}