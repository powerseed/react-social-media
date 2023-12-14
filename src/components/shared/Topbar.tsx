import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOut } from '@/lib/react-query/queriesAndMutations';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/AuthContext';

const Topbar = () => {
    const { mutate: signOut, isSuccess: isSignOutSuccess } = useSignOut();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (isSignOutSuccess) {
            navigate('/sign-in');
        }
    }, [isSignOutSuccess])

    return (
        <section className='topbar'>
            <div className='flex-between py-4 px-5'>
                <Link to='/' className='flex gap-3 items-center'>
                    <img src='/public/assets/images/logo.svg' alt='logo' width={130} height={325} />
                </Link>
            </div>

            <div className='flex gap-4'>
                <Button variant='ghost' className='shad-button_ghost' onClick={() => signOut}>
                    <img src='/public/assets/icons/logout.svg' alt='logout' />
                </Button>

                <Link to={`/profile/${user.id}`} className='flex-center gap-3'>
                    <img src={user.imageUrl || '/public/assets/icons/profile-placeholder.svg'} alt='profile' className='h-14 w-14 rounded-full' />
                    <div className='flex flex-col'>
                        <p className='body-bold'>
                            {user.email}
                        </p>
                    </div>
                </Link>
            </div>
        </section>
    )
}

export default Topbar