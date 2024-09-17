export const teamSchedule = [
    {
        apartments: {
            number: 1,
            floor: 1,
            contractid: 1,
            status: 'pending',
            doorWidth: 4,
            doorHeight: 10,
        },
        apartmentInScheduleItem: {
            contractid: 1,
            floor: 1,
            number: 1,
            itemid: 1,
        },
        scheduleItems: {
            id: 1,
            date: '',
            contractid: 1,
            itemType: 'installFrame',
            teamid: 1,
        },
        itemsInApartment: {
            itemid: 1,
            quantity: 1,
            contractid: 1,
            floor: 1,
            number: 1,
        },
        items: {
            id: 1,
            name: 'Door',
            quantity: 20,
            price: 30.5,
            width: 10,
            height: 20,
        },
        contracts: {
            id: 1,
            address: 'An address',
        },
    },
    {
        apartments: {
            number: 1,
            floor: 1,
            contractid: 1,
            status: 'pending',
            doorWidth: 4,
            doorHeight: 10,
        },
        apartmentInScheduleItem: {
            contractid: 1,
            floor: 1,
            number: 1,
            itemid: 1,
        },
        scheduleItems: {
            id: 1,
            date: '',
            contractid: 1,
            itemType: 'installFrame',
            teamid: 1,
        },
        itemsInApartment: {
            itemid: 2,
            quantity: 1,
            contractid: 1,
            floor: 1,
            number: 1,
        },
        items: {
            id: 2,
            name: 'Window',
            quantity: 20,
            price: 30.5,
            width: 10,
            height: 20,
        },
        contracts: {
            id: 1,
            address: 'An address',
        },
    },
    {
        apartments: {
            number: 2,
            floor: 1,
            contractid: 1,
            status: 'pending',
            doorWidth: 4,
            doorHeight: 10,
        },
        apartmentInScheduleItem: {
            contractid: 1,
            floor: 1,
            number: 2,
            itemid: 1,
        },
        scheduleItems: {
            id: 1,
            date: '',
            contractid: 1,
            itemType: 'installFrame',
            teamid: 1,
        },
        itemsInApartment: {
            itemid: 1,
            quantity: 1,
            contractid: 1,
            floor: 1,
            number: 2,
        },
        items: {
            id: 1,
            name: 'Door',
            quantity: 20,
            price: 30.5,
            width: 10,
            height: 20,
        },
        contracts: {
            id: 1,
            address: 'An address',
        },
    },
    {
        apartments: {
            number: 1,
            floor: 1,
            contractid: 2,
            status: 'pending',
            doorWidth: 4,
            doorHeight: 10,
        },
        apartmentInScheduleItem: {
            contractid: 2,
            floor: 1,
            number: 1,
            itemid: 2,
        },
        scheduleItems: {
            id: 2,
            date: '',
            contractid: 2,
            itemType: 'installFrame',
            teamid: 1,
        },
        itemsInApartment: {
            itemid: 1,
            quantity: 1,
            contractid: 2,
            floor: 1,
            number: 1,
        },
        items: {
            id: 1,
            name: 'Door',
            quantity: 20,
            price: 30.5,
            width: 10,
            height: 20,
        },
        contracts: {
            id: 2,
            address: 'An address',
        },
    },
];

export const teamScheduleResult = [
    {
        item: {
            id: 1,
            date: '',
            contractid: 1,
            itemType: 'installFrame',
            teamid: 1,
            address: 'An address',
        },
        apartments: [
            {
                number: 1,
                floor: 1,
                contractid: 1,
                status: 'pending',
                doorWidth: 4,
                doorHeight: 10,
                items: [
                    {
                        id: 1,
                        name: 'Door',
                        quantity: 1,
                        price: 30.5,
                        width: 10,
                        height: 20,
                    },
                    {
                        id: 2,
                        name: 'Window',
                        quantity: 1,
                        price: 30.5,
                        width: 10,
                        height: 20,
                    },
                ],
            },
            {
                number: 2,
                floor: 1,
                contractid: 1,
                status: 'pending',
                doorWidth: 4,
                doorHeight: 10,
                items: [
                    {
                        id: 1,
                        name: 'Door',
                        quantity: 1,
                        price: 30.5,
                        width: 10,
                        height: 20,
                    },
                ],
            },
        ],
    },
    {
        item: {
            id: 2,
            date: '',
            contractid: 2,
            itemType: 'installFrame',
            teamid: 1,
            address: 'An address',
        },
        apartments: [
            {
                number: 1,
                floor: 1,
                contractid: 2,
                status: 'pending',
                doorWidth: 4,
                doorHeight: 10,
                items: [
                    {
                        id: 1,
                        name: 'Door',
                        quantity: 1,
                        price: 30.5,
                        width: 10,
                        height: 20,
                    },
                ],
            },
        ],
    },
];

export const toCollectItems = [
    {
        scheduleItems: {
            id: 1,
        },
        apartments: {
            status: 'complete',
        },
    },
    {
        scheduleItems: {
            id: 1,
        },
        apartments: {
            status: 'complete',
        },
    },
    {
        scheduleItems: {
            id: 1,
        },
        apartments: {
            status: 'complete',
        },
    },
    {
        scheduleItems: {
            id: 2,
        },
        apartments: {
            status: 'pending',
        },
    },
    {
        scheduleItems: {
            id: 2,
        },
        apartments: {
            status: 'pending',
        },
    },
    {
        scheduleItems: {
            id: 3,
        },
        apartments: {
            status: 'complete',
        },
    },
    {
        scheduleItems: {
            id: 3,
        },
        apartments: {
            status: 'complete',
        },
    },
];

export const currentApartmentsInSchedItem = [
    {
        contractid: 1,
        floor: 1,
        number: 1,
        itemid: 1,
    },
    {
        contractid: 1,
        floor: 1,
        number: 2,
        itemid: 1,
    },
    {
        contractid: 1,
        floor: 1,
        number: 3,
        itemid: 1,
    },
    {
        contractid: 1,
        floor: 2,
        number: 1,
        itemid: 1,
    },
];

export const newApartmentsInSchedItem = [
    {
        floor: 1,
        number: 1,
    },
    {
        floor: 1,
        number: 3,
    },
    {
        floor: 2,
        number: 2,
    },
];
