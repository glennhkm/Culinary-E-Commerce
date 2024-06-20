"use client";

import { ManagePaymentMethod } from '@/components/cards/paymentMethod/managePaymentMethod';
import { CancelledOrder } from '@/components/userOrders/cancelledOrder';
import { OnProcess } from '@/components/userOrders/onProcess';
import { OrderDone } from '@/components/userOrders/orderDone';
import { WaitingPayment } from '@/components/userOrders/waitingPayment';
import { BadgeDollarSign } from 'lucide-react';
import React, { useState } from 'react'

const AdminOrders = () => {
  const [onShow, setOnShow] = useState(1);
  const [componentOnShow, setComponentOnShow] = useState(<WaitingPayment/>);
  const [isManagePaymentMethod, setIsManagePaymentMethod] = useState(false);
  const informationMenu = [
    {
      id: 1,
      name: "Menunggu Pembayaran",   
      component: <WaitingPayment/>  
    },
    {
      id: 2,
      name: "Diproses",
      component: <OnProcess/>
    },
    {
      id: 3,
      name: "Pesanan Selesai",
      component: <OrderDone/>    
    },
    {
      id: 4,
      name: "Pesanan Dibatalkan",
      component: <CancelledOrder/>      
    },
  ]

  const handleClickInformationMenu = (informationObject) => {
    setOnShow(informationObject.id);
    setComponentOnShow(informationObject.component);
  }


  return (
    <div className='tracking-wide font-extrabold text-main_bg flex flex-col gap-6 chrome-md:gap-8'>
      <div className='flex w-full justify-between'>
        <p className={`text-5xl tracking-wide font-extrabold chrome-md:text-7xl -mt-3`}>PESANAN</p>
        <button onClick={() => setIsManagePaymentMethod(true)} className='active:scale-[0.98] rounded-xl bg-primary hover:bg-dark_primary py-3 px-6 flex gap-2 text-main_bg items-center duration-200 font-semibold shadow-lg shadow-black/80'>
          <BadgeDollarSign size={20}/>
          <p>Kelola Metode Pembayaran</p>
        </button>
      </div>
      <div className="rounded-xl bg-[#151515] w-full shadow-lg flex flex-col gap-8 shadow-black mt-4 p-12 text-main_bg h-[76vh]">
        <div className="grid grid-cols-4">
          {informationMenu.map((item) => (
            <button key={item.id} onClick={() => handleClickInformationMenu(item)} className="hover:scale-105 active:scale-100 duration-200">
              <h3 key={item.id} onClick={() => setOnShow(item.id)} className={`duration-200 py-4 font-semibold rounded-t-xl ${item.id === onShow && 'text-center bg-main_bg/40'}`}>{item.name}</h3>
            </button>
          ))}            
          <div className="col-span-4 border-b-2 border-b-main_bg"></div>
        </div>
        <div className='font-normal'>
          {componentOnShow}
        </div>
      </div>
      {isManagePaymentMethod && (
        <ManagePaymentMethod closeModal={() => setIsManagePaymentMethod(false)}/>
      )}
    </div>
  )
}

export default AdminOrders