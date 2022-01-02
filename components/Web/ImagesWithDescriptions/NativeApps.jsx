import { DeviceMobileIcon } from "@heroicons/react/outline";

export default function NativeApps() {
  return (
    <div className="lg:pl-16 mt-16">
      <div className="lg:mx-auto lg:max-w-none lg:px-8 lg:grid lg:grid-cols-2 lg:grid-flow-col-dense lg:gap-24">
        <div className="px-4 max-w-xl mx-auto lg:py-16 lg:max-w-4xl lg:mx-0 lg:mt-16 lg:px-0 lg:pl-10">
          <div>
            <div>
                <span className="h-12 w-12 rounded-md flex items-center justify-center bg-yellow-400">
                  <DeviceMobileIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </span>
            </div>
            <div className="mt-6">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                <span>Your goals, and all the details.{' '}</span>
                <span className="block">Right where you need them.</span>
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                We understand that goals evolve, especially ambitious ones. That's why Tattle is not only available on the web, but also as native iOS and Android apps too.
              </p>
              <div className="mt-6">
                <a
                  href="#"
                  className="inline-flex px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-yellow-400 hover:bg-yellow-500"
                >
                  Get started
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 w-full lg:w-320">
          <div className="static flex justify-center lg:px-0 lg:m-0 lg:relative">
            <img
              className="static w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl rounded-xl lg:absolute lg:left-0 transition ease-in-out delay-150 duration-700 lg:hover:-translate-x-32"
              src="/goals-screenshot.png"
              alt="Index page interface"
            />
          </div>
        </div>
      </div>
    </div>
  )
}