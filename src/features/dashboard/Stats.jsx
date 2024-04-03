import React from 'react';
import Stat from './Stat';
import { HiOutlineBanknotes, HiOutlineBriefcase, HiOutlineCalendarDays, HiOutlineChartBar } from 'react-icons/hi2';
import { formatCurrency } from '../../utils/helpers';

export default function Stats({bookings, confirmedStays, numDays, cabinCount}) {

    //1. Total bookings
    const numBookings = bookings.length; 

    //2. Total sales
    const sales = bookings.reduce((acc, booking) => {
        return acc + booking.totalPrice
    }, 0)

    //3. Total check-ins
    const checkins = confirmedStays.length;

    //4. Occupation
    const occupation = confirmedStays.reduce((acc, confStay) => {
        return acc + confStay.numNights
    }, 0 ) / (numDays * cabinCount )
        //num checked in nights / all available nights (num days * num cabins)



    return <>
        <Stat 
            title='Bookings' 
            color='blue'
            icon={<HiOutlineBriefcase/>} 
            value={numBookings}
        />
        <Stat 
            title='Sales' 
            color='green'
            icon={<HiOutlineBanknotes/>} 
            value={formatCurrency(sales)}
        />
        <Stat 
            title='Check ins' 
            color='indigo'
            icon={<HiOutlineCalendarDays/>} 
            value={checkins}
        />
        <Stat 
            title='Occupancy rate' 
            color='yellow'
            icon={<HiOutlineChartBar/>} 
            value={Math.round(occupation * 100) +  "%"}
        />
    </>
}
