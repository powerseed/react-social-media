import { sidebarLinks } from '@/constants';
import { AuthContext } from '@/context/AuthContext';
import { INavLink } from '@/types';
import { useContext, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button';
import { useSignOut } from '@/lib/react-query/queriesAndMutations';

const Leftbar = () => {
  const { user } = useContext(AuthContext);
  const { pathname } = useLocation();
  const { mutate: signOut, isSuccess: isSignOutSuccess } = useSignOut();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignOutSuccess) {
      navigate('/sign-in');
    }
  }, [isSignOutSuccess])

  return (
    <nav className='leftsidebar'>
      <div className='flex flex-col gap-11'>
        <Link to='/' className='flex gap-3 items-center'>
          <img src='/public/assets/images/logo.svg' alt='logo' width={170} height={36} />
        </Link>

        <Link to={`/profile/${user.id}`} className='flex gap-3 items-center'>
          <img src={user.imageUrl || '/public/assets/icons/profile-placeholder.svg'} alt='profile' className='h-8 w-8 rounded-full' />
          <div className='small-regular text-light-3'>
            {user.email}
          </div>
        </Link>

        <ul className='flex flex-col gap-6'>
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              <li key={link.label} className={`leftsidebar-link group ${isActive && 'bg-primary-500'}`}>
                <NavLink to={link.route} className='flex gap-4 items-center p-4'>
                  <img src={link.imgURL} alt={link.label} className={`group-hover:invert-white ${isActive && 'invert-white'}`} />
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>

      <Button variant='ghost' className='shad-button_ghost' onClick={() => signOut}>
        <img src='/public/assets/icons/logout.svg' alt='logout' />
        <p className='small-medium lg:base-medium'>Sign out</p>
      </Button>
    </nav>
  )
}

export default Leftbar