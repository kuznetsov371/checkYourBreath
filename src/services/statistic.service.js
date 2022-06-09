const { UserData } = require('../models');
const { Measurement } = require('../models');
const adminService = require('./admin.service');

const updateStatistic = async (user,measurement) =>{

    let newUserData = null;

    //if new highest measurement
    if(measurement.value > user.highest){
        newUserData = await UserData.findOneAndUpdate({_id:user._id},{highest:measurement.value},{new: true });
    }

    const measurements = await Measurement.find({ uid: user._id });

    //if user's first measurement ever
    if(measurements.length == 1){
        newUserData = await UserData.findOneAndUpdate({_id:user._id},{daysDrunk: 1, record: 1},{ new: true });
    }else{

        // counting total days difference
        const previusMeasurementDate =  measurements[measurements.length - 2].date;
        const difference = measurement.date.getTime() - previusMeasurementDate.getTime();
        const totalDays = Math.ceil(difference / (1000 * 3600 * 24) - 1);

        if(totalDays == 1){
            //if new record
            if((user.daysDrunk + 1) > user.record){
                newUserData = await UserData.findOneAndUpdate({_id:user._id},{daysDrunk: (user.daysDrunk + 1), record: (user.record + 1) },{ new: true });
            }else{
                newUserData = await UserData.findOneAndUpdate({_id:user._id},{daysDrunk: (user.daysDrunk + 1)},{ new: true });
            }
        }else if(totalDays > 1){
            newUserData = await UserData.findOneAndUpdate({_id:user._id},{daysDrunk: 1},{ new: true }); 
        }
    }

    //if some changes - send message
    if(newUserData){
        console.log(newUserData);
        await adminService.sendMessage(user.cmToken, null, {
            message: "user_data_updated",
            data: JSON.stringify(newUserData)
        });
    }
};

module.exports = {
    updateStatistic
}