import React from 'react';
import StarIconV2 from './icons/StarV2';
import StarIcon from './icons/StarIcon';

interface ListStarProps {
    star: number;
    size ?: number;
}

const list = [1, 2, 3, 4, 5];
export const ListStar: React.FC<ListStarProps> = ({ star, size = 22 }) => {

    return (
        <div className="flex gap-2">
            {list.map((item) => {
                const percentage = item <= star ? 100 : item === Math.ceil(star) ? (star % 1) * 100 : 0;
                return <StarIcon key={item} complete={`${percentage}%`} size={size} />;
            })}
        </div>
    );
};
// if (item <= star) {
//     return <StarIconV2 key={item} fill="#F79009" size={size} />;
// } else if (item === Math.ceil(star)) {
//     const percentage = (star % 1) * 100;
//     return <StarIcon key={item} complete={`${percentage}%`} size={size} />;
// } else {
//     return <StarIconV2 key={item} fill="#D0D5DD" size={size} />;
// }