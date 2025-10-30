import React from "react";
import logo from "../assests/logo.png";

const Footer = () => {
  return (
    <section class="py-10 bg-gray-50 sm:pt-16 lg:pt-24">
      <div class="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div class="grid grid-cols-2 md:col-span-3 lg:grid-cols-6 gap-y-16 gap-x-12">
          <div class="col-span-2 md:col-span-3 lg:col-span-2 lg:pr-8 ">
            <img class="w-32 h-13 " src={logo} alt="logo" />
            <p class="text-[85%] leading-relaxed text-gray-600 mt-7 text-left">
              Expert diagnostics ensure accurate identification, thorough
              analysis, and effective resolution of even the most complex issues
              with precision and efficiency.
            </p>

            <ul class="flex items-center space-x-3 mt-9">
              <li>
                <a
                  href="https://www.youtube.com/@expertdiagnosticshassan?si=4YE39CC8-FAnt5Lr"
                  title="YouTube"
                  class="flex items-center justify-center text-white transition-all duration-200 bg-[#eb7801] rounded-full w-7 h-7 hover:bg-[#ad70d5] focus:bg-[#ad70d5]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4"
                    viewBox="0 0 576 512"
                    fill="currentColor"
                  >
                    <path d="M549.7 124.1c-6.3-24-25-42.7-49-49C456.5 64 288 64 288 64S119.5 64 75.3 75.1c-24 6.3-42.7 25-49 49C16 168.4 16 256 16 256s0 87.6 10.3 131.9c6.3 24 25 42.7 49 49C119.5 448 288 448 288 448s168.5 0 212.7-11.1c24-6.3 42.7-25 49-49C560 343.6 560 256 560 256s0-87.6-10.3-131.9zM232 336V176l142 80-142 80z" />
                  </svg>
                </a>
              </li>

              <li>
                <a
                  href="https://www.facebook.com/share/176qYGraDf/"
                  title=""
                  class="flex items-center justify-center text-white transition-all duration-200 bg-[#eb7801] rounded-full w-7 h-7 hover:bg-[#ad70d5] focus:bg-[#ad70d5]"
                >
                  <svg
                    class="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"></path>
                  </svg>
                </a>
              </li>

              <li>
                <a
                  href="https://www.instagram.com/expertdiagnosticshassan/?igsh=MTh6aHh5MTcyaHU2aw%3D%3D#"
                  title=""
                  class="flex items-center justify-center text-white transition-all duration-200 bg-[#eb7801] rounded-full w-7 h-7 hover:bg-[#ad70d5] focus:bg-[#ad70d5]"
                >
                  <svg
                    class="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.999 7.377a4.623 4.623 0 1 0 0 9.248 4.623 4.623 0 0 0 0-9.248zm0 7.627a3.004 3.004 0 1 1 0-6.008 3.004 3.004 0 0 1 0 6.008z"></path>
                    <circle cx="16.806" cy="7.207" r="1.078"></circle>
                    <path d="M20.533 6.111A4.605 4.605 0 0 0 17.9 3.479a6.606 6.606 0 0 0-2.186-.42c-.963-.042-1.268-.054-3.71-.054s-2.755 0-3.71.054a6.554 6.554 0 0 0-2.184.42 4.6 4.6 0 0 0-2.633 2.632 6.585 6.585 0 0 0-.419 2.186c-.043.962-.056 1.267-.056 3.71 0 2.442 0 2.753.056 3.71.015.748.156 1.486.419 2.187a4.61 4.61 0 0 0 2.634 2.632 6.584 6.584 0 0 0 2.185.45c.963.042 1.268.055 3.71.055s2.755 0 3.71-.055a6.615 6.615 0 0 0 2.186-.419 4.613 4.613 0 0 0 2.633-2.633c.263-.7.404-1.438.419-2.186.043-.962.056-1.267.056-3.71s0-2.753-.056-3.71a6.581 6.581 0 0 0-.421-2.217zm-1.218 9.532a5.043 5.043 0 0 1-.311 1.688 2.987 2.987 0 0 1-1.712 1.711 4.985 4.985 0 0 1-1.67.311c-.95.044-1.218.055-3.654.055-2.438 0-2.687 0-3.655-.055a4.96 4.96 0 0 1-1.669-.311 2.985 2.985 0 0 1-1.719-1.711 5.08 5.08 0 0 1-.311-1.669c-.043-.95-.053-1.218-.053-3.654 0-2.437 0-2.686.053-3.655a5.038 5.038 0 0 1 .311-1.687c.305-.789.93-1.41 1.719-1.712a5.01 5.01 0 0 1 1.669-.311c.951-.043 1.218-.055 3.655-.055s2.687 0 3.654.055a4.96 4.96 0 0 1 1.67.311 2.991 2.991 0 0 1 1.712 1.712 5.08 5.08 0 0 1 .311 1.669c.043.951.054 1.218.054 3.655 0 2.436 0 2.698-.043 3.654h-.011z"></path>
                  </svg>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p class="text-sm font-semibold tracking-widest text-gray-400 uppercase text-left">
              Our Service
            </p>

            <ul class="mt-6 space-y-4 text-[85%]">
              <li>
                <a
                  href="/about"
                  title="about"
                  class="flex  text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                >
                  {" "}
                  About{" "}
                </a>
              </li>

              <li>
                <a
                  href="/contact-us"
                  title="contact us"
                  class="flex  text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                >
                  {" "}
                  Contact{" "}
                </a>
              </li>

              <li>
                <a
                  href="/career"
                  title=""
                  class="flex  text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                >
                  {" "}
                  Career{" "}
                </a>
              </li>

              <li>
                <a
                  href="/admin-login"
                  title=""
                  class="flex  text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                >
                  {" "}
                  Admin Login{" "}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p class="text-sm font-semibold tracking-widest text-gray-400 uppercase text-left">
              Policy
            </p>

            <ul class="mt-6 space-y-4 text-[85%]">
              <li>
                <a
                  href="/term-condition"
                  title=""
                  class="flex  text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                >
                  {" "}
                  Terms of use{" "}
                </a>
              </li>

              <li>
                <a
                  href="#"
                  title=""
                  class="flex  text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                >
                  {" "}
                  Cookie Policy{" "}
                </a>
              </li>

              <li>
                <a
                  href="#"
                  title=""
                  class="flex  text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                >
                  {" "}
                  Desclaimer{" "}
                </a>
              </li>

              <li>
                <a
                  href="/privacy-policy"
                  title=""
                  class="flex  text-black transition-all duration-200 hover:text-blue-600 focus:text-blue-600"
                >
                  {" "}
                  Privacy Policy{" "}
                </a>
              </li>
            </ul>
          </div>

          <div class="col-span-2 md:col-span-1 lg:col-span-2 lg:pl-8">
            <p class="text-sm font-semibold tracking-widest text-gray-400 uppercase text-left">
              Enter Your Email
            </p>

            <form action="#" method="POST" class="mt-6 text-left">
              <div>
                <label for="email" class="sr-only">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  class="block w-full p-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600 text-[85%]"
                />
              </div>

              <button
                type="submit"
                class="inline-flex items-center justify-center px-5 py-2 mt-3 font-semibold text-white transition-all duration-200 bg-[#ad70d5] rounded-md hover:bg-[#eb7801] focus:bg-[#eb7801] "
              >
                Click Me
              </button>
            </form>
          </div>
        </div>

        <hr class="mt-16 mb-10 border-gray-200" />

        <p class="text-sm text-center text-gray-600">
          © Copyright 2024, All Rights Reserved by Expert Diagnostics
        </p>
      </div>
    </section>
  );
};

export default Footer;
