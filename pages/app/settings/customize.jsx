import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { DuplicateIcon } from "@heroicons/react/outline";
import { getCustomMessages, updateCustomMessages } from "../../api/v1/customMessages";
import AppLayout from "../../../components/App/Layout/AppLayout";
import Card from "../../../components/Global/Card";
import CardTitle from "../../../components/Global/CardTitle";
import CustomSms from "../../../components/App/Profile/CustomSms";
import CustomVoice from "../../../components/App/Profile/CustomVoice";
import StateWrapper from "../../../components/App/Layout/StateWrapper";
import Button from "../../../components/Global/Button";

export default function Customize() {
  const [smsMessageText, setSmsMessageText] = useState('')
  const [voiceMessageText, setVoiceMessageText] = useState('')
  const [customId, setCustomId] = useState()

  const [isCopied, setIsCopied] = useState(false)
  const [copyText, setCopyText] = useState(null)

  useEffect(() => {
    const user = supabase.auth.user()
    getCustomMessages(user?.id, setSmsMessageText, setVoiceMessageText, setCustomId)
  }, [])

  function handleUpdate() {
    const user = supabase.auth.user()
    return updateCustomMessages(customId, user?.id, smsMessageText, voiceMessageText)
  }

  function handleCopy(variableToCopy) {
    setCopyText(variableToCopy)
    setIsCopied(true)
    setTimeout(() => {
      setIsCopied(false)
      setCopyText('')
    }, 2000)
    return navigator.clipboard.writeText(variableToCopy)
  }

  return (
    <AppLayout>
      <StateWrapper>
        <div className="flex">
          <CardTitle>Customize</CardTitle>
          <div className="max-w-min fixed flex-end right-40">
            <Button onClickHandler={() => handleUpdate()}>Save</Button>
          </div>
        </div>
        <Card>
          <CardTitle>Have some fun with it</CardTitle>
          In the event that you don't achieve your goal, Tattle sends an SMS or voice message to the contact you specified. Use these settings to change the text or voice script that is sent to your contact.
        </Card>
        <Card>
          <h3 className="text-xl font-extrabold">Variables</h3>
          <p className="mt-3 mb-6">Use these variables to output data dynamically in your SMS or voice messages.</p>
          <div className="overflow-scroll">
          <table className="min-w-full divide-y divide-gray-200 overflow-scroll">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="max-w-6xs sm:max-w-4xl px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Copy
                </th>
                <th
                  scope="col"
                  className="pl-8 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Variable
                </th>

                <th
                  scope="col"
                  className="pl-8 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider overflow-scroll"
                >
                  Output
                </th>
              </tr>
            </thead>
            <tr className="overflow-scroll">
              <td className="max-w-5xs flex justify-center sm:pl-7 py-4 whitespace-pre-line text-sm text-gray-500">
                <div onClick={() => handleCopy("{{ contact_name }}")} className="w-4 h-4 xs:w-6 xs:h-6 pt-2 xs:pt-0 cursor-pointer text-sm xs:text-md">
                  {copyText !== "{{ contact_name }}" && <DuplicateIcon/>}
                  {isCopied && copyText === "{{ contact_name }}" && <span>Copied!</span>}
                </div>
              </td>
              <td className="max-w-5xs pl-0 sm:pl-8 py-4 whitespace-pre-line font-mono text-sm text-gray-600">
                <code className="text-2xs xs:text-xs sm:text-sm">{"{{ contact_name }}"}</code>
              </td>
              <td className="max-w-5xs pl-0 sm:pl-8 py-4 whitespace-pre-line text-2xs sm:text-sm text-gray-500">
                Outputs the name of your contact.
              </td>
            </tr>
            <tr>
              <td className="max-w-5xs flex justify-center sm:pl-7 py-4 whitespace-pre-line text-sm text-gray-500">
                <div onClick={() => handleCopy("{{ user_name }}")} className="w-4 h-4 xs:w-6 xs:h-6 pt-2 xs:pt-0 cursor-pointer text-sm xs:text-md">
                  {copyText !== "{{ user_name }}" && <DuplicateIcon/>}
                  {isCopied && copyText === "{{ user_name }}" && <span>Copied!</span>}
                </div>
              </td>
              <td className="max-w-5xs pl-0 sm:pl-8 py-4 whitespace-pre-line font-mono text-sm text-gray-600">
                <code className="text-2xs xs:text-xs sm:text-sm">{"{{ user_name }}"}</code>
              </td>
              <td className="max-w-5xs pl-0 sm:pl-8 py-4 whitespace-pre-line text-2xs sm:text-sm text-gray-500">
                Outputs your name.
              </td>
            </tr>
            <tr>
              <td className="max-w-5xs flex justify-center sm:pl-7 py-4 whitespace-pre-line text-sm text-gray-500">
                <div onClick={() => handleCopy("{{ goal_title }}")} className="w-4 h-4 xs:w-6 xs:h-6 pt-2 xs:pt-0 cursor-pointer text-sm xs:text-md">
                  {copyText !== "{{ goal_title }}" && <DuplicateIcon/>}
                  {isCopied && copyText === "{{ goal_title }}" && <span>Copied!</span>}
                </div>
              </td>
              <td className="max-w-5xs pl-0 sm:pl-8 py-4 whitespace-pre-line font-mono text-sm text-gray-600">
                <code className="text-2xs xs:text-xs sm:text-sm">{"{{ goal_title }}"}</code>
              </td>
              <td className="max-w-5xs pl-0 sm:pl-8 py-4 whitespace-pre-line text-2xs sm:text-sm text-gray-500">
                Outputs the title of your goal.
              </td>
            </tr>
          </table>
          </div>
        </Card>
        <CustomSms smsMessageText={smsMessageText} setSmsMessageText={setSmsMessageText} />
        <CustomVoice voiceMessageText={voiceMessageText} setVoiceMessageText={setVoiceMessageText} />
      </StateWrapper>
    </AppLayout>
  )
}