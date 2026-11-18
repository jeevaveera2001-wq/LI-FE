import React from 'react';

export default function Sidebar({ onNavigate, currentPage = 'home', currentUser }) {
  const handleNav = (page) => (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const isSuperAdmin = currentUser && (currentUser.role === 'superadmin' || currentUser.email === 'superadmin@lt.in');
  const isUser = currentUser && !isSuperAdmin;

  return (
    <div className="hidden lg:block">
      <nav aria-label="Main navigation" className="fixed z-90 flex h-full max-h-dvh items-center justify-center webview-hide">
        <div className="shadow-sidebar w-sidebar-width flex h-full flex-col items-center justify-between bg-white">
          <a href="/en/" onClick={handleNav('home')} className="block w-full focus:outline-none cursor-pointer">
            <img alt="LT.IN Logo" className="h-auto w-full px-1.5 pt-8 select-none" src="/assets/lt_acronym_black.png" />
          </a>
          
          <div className="flex w-full flex-col overflow-hidden">
            <div>
              <div className="relative">
                <a href="/en/" onClick={handleNav('home')} className="cursor-pointer">
                  <div className={`lg:hover:bg-white-dirty group grid h-full items-start justify-center justify-items-center gap-1 text-center sm:px-0 sm:py-1.5 lg:flex-col lg:items-center lg:justify-center lg:p-3 ${currentPage === 'home' ? 'lg:bg-white-dirty' : ''}`}>
                    <span className="material-symbols-outlined text-dark-default lg:group-hover:text-gold-primary! text-[24px]! lg:text-[26px]! lg:text-gold-primary">Home</span>
                    <span className="text-dark-default primary-regular-s10-lh130 lg:primary-bold-s10-lh130 capitalize">Home</span>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <div className="relative">
                <a href="/en/road-to-lt-in" onClick={handleNav('home')} className="cursor-pointer">
                  <div className="lg:hover:bg-white-dirty group grid h-full items-start justify-center justify-items-center gap-1 text-center sm:px-0 sm:py-1.5 lg:flex-col lg:items-center lg:justify-center lg:p-3">
                    <span className="material-symbols-outlined text-dark-default lg:group-hover:text-gold-primary! text-[24px]! lg:text-[26px]!">conversion_path</span>
                    <span className="text-dark-default primary-regular-s10-lh130 lg:primary-bold-s10-lh130 capitalize">Road to LT.IN</span>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <div className="relative">
                <a href="/en/play/dashboard" onClick={handleNav('register')} className="cursor-pointer">
                  <div className="lg:hover:bg-white-dirty group grid h-full items-start justify-center justify-items-center gap-1 text-center sm:px-0 sm:py-1.5 lg:flex-col lg:items-center lg:justify-center lg:p-3">
                    <svg aria-hidden="true" className="text-dark-default lg:group-hover:text-gold-primary! size-6 shrink-0 lg:size-6.5" fill="none" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
                      <g>
                        <path className="nJsbAG_blade nJsbAG_bA" d="M 11.2526,18.942 C 11.1678,18.8317 11.1341,18.6996 11.173599999999999,18.575499999999998 C 11.2098,18.4603 11.2732,18.3725 11.4066,18.3161 L 17.543999999999997,15.6949 C 17.6946,15.630399999999998 17.7934,15.5458 17.8256,15.408100000000001 C 17.865099999999998,15.238900000000001 17.7967,15.1294 17.6913,15.005299999999998 L 14.206,10.8881 C 14.077599999999999,10.735899999999999 14.1204,10.516 14.2349,10.3919 C 14.3567,10.2606 14.5823,10.1873 14.7462,10.3017 L 23.3923,16.3409 C 23.5298,16.436799999999998 23.5858,16.5914 23.5537,16.749299999999998 C 23.528999999999996,16.8702 23.426899999999996,17.0305 23.261400000000002,17.0595 L 11.655199999999999,19.0838 C 11.4955,19.112 11.346499999999999,19.0661 11.2518,18.9428 L 11.2526,18.942" fill="currentColor"></path>
                        <path className="nJsbAG_blade nJsbAG_bB" d="M 13.049199999999999,7.78121 C 12.8384,7.629759999999999 12.549399999999999,7.740119999999999 12.465399999999999,7.96326 L 10.5412,13.0261 C 10.4712,13.2098 10.3066,13.3097 10.111429999999999,13.284699999999999 C 9.845479999999998,13.2533 9.69069,13.0221 9.75244,12.761099999999999 L 10.7652,2.53064 C 10.784099999999999,2.34294 10.938099999999999,2.2237199999999997 11.100299999999999,2.1915 C 11.296299999999999,2.15203 11.431299999999998,2.25514 11.552299999999999,2.3952999999999998 L 19.0038,11.0525 C 19.095999999999997,11.159699999999999 19.1841,11.266 19.1685,11.4062 C 19.1438,11.6229 18.9651,11.7945 18.741099999999996,11.7961 C 18.6464,11.7961 18.5616,11.7526 18.4842,11.6962 L 13.049199999999999,7.78121" fill="currentColor"></path>
                        <path className="nJsbAG_blade nJsbAG_bC" d="M 14.733799999999999,15.4783 C 14.7412,15.6419 14.6646,15.7804 14.517199999999999,15.846499999999999 L 4.821249999999999,20.161 C 4.715039999999999,20.1924 4.648339999999999,20.1892 4.5495399999999995,20.1505 C 4.370049999999999,20.0805 4.221019999999999,19.8734 4.2967699999999995,19.668 L 8.331259999999999,8.7697 C 8.407839999999998,8.5619 8.673779999999999,8.51357 8.85245,8.58123 C 9.015479999999998,8.64326 9.092049999999999,8.7633 9.11923,8.934099999999999 L 8.36749,15.4832 C 8.35102,15.627400000000002 8.346079999999999,15.7498 8.442419999999998,15.857 C 8.52723,15.9512 8.657319999999999,16.0189 8.813759999999998,15.993099999999998 L 14.2595,15.089300000000001 C 14.508199999999999,15.048200000000001 14.722199999999999,15.2254 14.734599999999999,15.4783 L 14.733799999999999,15.4783" fill="currentColor"></path>
                      </g>
                    </svg>
                    <span className="text-dark-default primary-regular-s10-lh130 lg:primary-bold-s10-lh130 capitalize">Play</span>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <div className="relative">
                <a href="/en/" onClick={handleNav('home')} className="cursor-pointer">
                  <div className="lg:hover:bg-white-dirty group grid h-full items-start justify-center justify-items-center gap-1 text-center sm:px-0 sm:py-1.5 lg:flex-col lg:items-center lg:justify-center lg:p-3">
                    <span className="material-symbols-outlined text-dark-default lg:group-hover:text-gold-primary! text-[24px]! lg:text-[26px]!">tv</span>
                    <span className="text-dark-default primary-regular-s10-lh130 lg:primary-bold-s10-lh130 capitalize">Programs</span>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <div className="relative">
                <a href="/en/news" onClick={handleNav('home')} className="cursor-pointer">
                  <div className="lg:hover:bg-white-dirty group grid h-full items-start justify-center justify-items-center gap-1 text-center sm:px-0 sm:py-1.5 lg:flex-col lg:items-center lg:justify-center lg:p-3">
                    <span className="material-symbols-outlined text-dark-default lg:group-hover:text-gold-primary! text-[24px]! lg:text-[26px]!">gallery_thumbnail</span>
                    <span className="text-dark-default primary-regular-s10-lh130 lg:primary-bold-s10-lh130 capitalize">Media</span>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <div className="relative">
                <a href="/en/about" onClick={handleNav('home')} className="cursor-pointer">
                  <div className="lg:hover:bg-white-dirty group grid h-full items-start justify-center justify-items-center gap-1 text-center sm:px-0 sm:py-1.5 lg:flex-col lg:items-center lg:justify-center lg:p-3">
                    <span className="material-symbols-outlined text-dark-default lg:group-hover:text-gold-primary! text-[24px]! lg:text-[26px]!">help</span>
                    <span className="text-dark-default primary-regular-s10-lh130 lg:primary-bold-s10-lh130 capitalize">About</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* User / Login Action in Sidebar */}
          <div className="relative flex w-full flex-col">
            <a
              href={isSuperAdmin ? "/admin" : isUser ? "/dashboard" : "/en/login"}
              onClick={handleNav(isSuperAdmin ? 'admin-dashboard' : isUser ? 'user-dashboard' : 'login')}
              className={`flex cursor-pointer flex-col items-center gap-1 px-3 py-4 transition-colors ${
                currentPage === 'admin-dashboard' || currentPage === 'user-dashboard' || currentPage === 'login' || currentPage === 'register'
                  ? 'bg-gold-primary text-black font-bold'
                  : 'bg-dark-default text-white hover:bg-gold-primary hover:text-black'
              }`}
            >
              {isSuperAdmin ? (
                <span className="text-[20px]">👑</span>
              ) : isUser ? (
                <span className="text-[20px]">👤</span>
              ) : (
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="size-[26px]" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M399 384.2C376.9 345.8 335.4 320 288 320l-64 0c-47.4 0-88.9 25.8-111 64.2c35.2 39.2 86.2 63.8 143 63.8s107.8-24.7 143-63.8zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm256 16a72 72 0 1 0 0-144 72 72 0 1 0 0 144z"></path>
                </svg>
              )}
              <p className="primary-bold-s10-lh130 max-w-full truncate capitalize">
                {isSuperAdmin ? 'Admin' : isUser ? 'Dashboard' : (currentPage === 'login' || currentPage === 'register' ? 'Portal' : 'Login')}
              </p>
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}
