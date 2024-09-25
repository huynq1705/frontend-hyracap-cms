import { AnimatePresence, AnimationProps, motion } from 'framer-motion';
import { memo } from 'react';

type AnimatedContainerProps = Partial<AnimationProps> & {
    children: React.ReactNode
}

const AnimatedContainer = ({
    children,
    ...props
}: AnimatedContainerProps): JSX.Element => {

    return (
        // <AnimatePresence mode="wait">
        //     <motion.div
        //         className="h-[inherit] w-[inherit] relative"
        //         key={location.pathname}
        //         initial={{ opacity: 0 }}
        //         animate={{ opacity: 1 }}
        //         transition={{ duration: 0.1, type: "tween" }}
        //         exit={{ opacity: 0 }}
        //         {...props}
        //     >
        //         {children}
        //     </motion.div>
        // </AnimatePresence>
        <>
        {children}
        </>
    )
}

export default memo(AnimatedContainer)
