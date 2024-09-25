import useCustomTranslation from '@/hooks/useCustomTranslation';
import { memo } from 'react';
import { Link } from 'react-router-dom';

const NotFound = (): JSX.Element => {
    const {T} = useCustomTranslation();

    return (
        <div className="p-4 bg-background h-full w-full flex pt-20 items-center flex-col select-none text-center child:lg:max-w-[50%] child:max-w-[100%]">
            <div className="text-9xl font-mono text-slate-600 tracking-wider">404</div>
            <div className="text-2xl text-slate-800 font-bold font-sans mb-4">{T('pageNotFound')}</div>
            <Link
                to="/admin">
                <div className="text-primary/80 hover:underline hover:text-primary">{T('returnHome')}</div>
            </Link>
        </div>
    )
}

export default memo(NotFound)
