import React from 'react';

const CheckOutItem = ({ item }) => {
    const { title, image, price, amount } = item;

    return (
        <div className="flex gap-x-4 py-2 border-b border-gray-200 w-full font-light text-gray-500">
            <div className="w-full flex items-center gap-x-4">
                {/* Image */}
                <img className="max-w-[80px]" src={image} alt="" />
                <div className="w-full flex flex-col">
                    {/* Title */}
                    <div className="flex justify-between mb-2">
                        <span className="text-sm uppercase font-medium text-primary">{title}</span>
                    </div>
                    <div className="flex gap-x-2 h-[36px] text-sm">
                        {/* Quantity */}
                        <div className="flex items-center text-primary font-medium">
                            Quantity: {amount}
                        </div>
                        {/* Item Price */}
                        <div className="flex items-center justify-center">
                            $ {price}
                        </div>
                        {/* Final Price */}
                        <div className="flex items-center justify-end text-primary font-medium">
                            ${parseFloat(price * amount).toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckOutItem;
