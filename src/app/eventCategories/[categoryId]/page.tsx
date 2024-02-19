"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import {
    superEvents,
    mehendiDetails,
    weaningDetails
} from "../../../../raw-data/dummyEvents";
import LoadingSkeleton from "./loadingSkeleton";

interface GetEventDetails {
    isLoading: boolean;
    data: any;
    error: any;
}

interface Organizer {
    name: string,
    userId: string,
    phoneNumber: string,
}

interface Event {
    id: string;
    title: string;
    image: string | undefined;
    description: string | undefined;
    organizers: Organizer[]
}

interface SuperEvent {
    id: string,
    title: string;
    description: string | undefined;
    image: string | undefined;
    events : Event[],
}

const IndividualEventPage = () => {
    const params = useParams();
    const router = useRouter();
    const [getEvent, setGetEvent] = useState<GetEventDetails>({
        isLoading: false,
        data: null,
        error: null,
    });

    const [getSuperEvent, setGetSuperEvent] = useState<SuperEvent>({
        title: "",
        events: [],
        id: "",
        description: "",
        image: ""
    });

    const getEventDetails = async () => {
        setGetEvent({
            ...getEvent,
            isLoading: true,
        });
        try {
            setGetEvent({
                ...getEvent,
                data: superEvents,
                isLoading: false,
            });
            // const res = await instance.get("getEventsData", );
            // if (res) {
            //   setGetEvent({
            //     ...getEvent,
            //     data: superEvents,
            //     isLoading: false,
            //   });
        } catch (error) {
            if (error instanceof Error) {
                setGetEvent({
                    ...getEvent,
                    error: error.message
                        ? error.message
                        : "An error occurred while loading events",
                    isLoading: false,
                });
            } else {
                setGetEvent({
                    ...getEvent,
                    error: "An error occurred while loading events",
                    isLoading: false,
                });
            }
            console.log(error);
        }
    };

    useEffect(() => {
        getEventDetails();
    }, []);

    useEffect(() => {
        if (getEvent.data) {
            const superEvent = getEvent.data.find(
                (event: any) => event.id == params.categoryId
            );
            console.log(superEvent);
            const selectedModule = () => {
                switch (params.courseId) {
                    case "1":
                        return mehendiDetails;
                    case "2":
                        return weaningDetails;
                    default:
                        return mehendiDetails;
                }
            }
            const moduleDetails = selectedModule();
            // @ts-ignore
            const updatedEvents: Event[] = superEvent.events?.map(
                (event: any) => {
                    const updatedEvent = moduleDetails.find(
                        (details: any) => details.id == event.id
                    );
                    if (updatedEvent) {
                        return {
                            ...event,
                            image: updatedEvent.image,
                            description: updatedEvent.description,
                        };
                    }
                    return event;
                }
            );

            // @ts-ignore
            const updatedTitle: string = superEvent.title;
            // @ts-ignore
            const updatedImage: string = superEvent.image;
            // @ts-ignore
            const updatedId: string = superEvent.id;

            setGetSuperEvent({
                events: updatedEvents,
                id: updatedId,
                description: getSuperEvent.description,
                image: updatedImage,
                title: updatedTitle,
            });
        }
    }, [getEvent.data, params.eventId]);


    return (
        <div className="flex flex-col gap-10">
            <span className="text-3xl font-black text-center">Select a theme for your {getSuperEvent.title}</span>
            {getEvent.isLoading && <LoadingSkeleton />}
            {getEvent.error && (
                <div className="flex flex-col gap-5 justify-center items-center">
                    <Image
                        src={"/images/error.jpg"}
                        height={500}
                        width={500}
                        alt="error"
                    />
                    <span className="text-5xl font-bold">Ooops,</span>
                    <span>{getEvent.error}</span>
                </div>
            )}
            {getEvent.data && (
                <>
                    <div className="flex">
                        <div className="w-[40%] items-center">
                    <span className="text-2xl font-bold">
                {/*Select a theme for your {getSuperEvent.title}*/}
              </span>
                            <div className="gap-2"></div>
                            {/*<Image*/}
                            {/*    width={200}*/}
                            {/*    height={200}*/}
                            {/*    style={{height: 200, width: "100%", objectFit: "contain"}}*/}
                            {/*    alt="event"*/}
                            {/*    src={getSuperEvent.image ? getSuperEvent.image : ""}*/}
                            {/*/>*/}
                        </div>
                        <div className="flex flex-col w-[60%] gap-7">

                            <div className="flex justify-between w-[100%]">
                                <div className="flex items-center gap-2">
                      <span className="font-thin text-sm">
                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                      <span className="font-thin text-sm">
                    {/*{individualEvent?.lessonsCount} Lessons*/}
                  </span>
                                </div>
                            </div>
                            <span className="text-sm ">{getSuperEvent?.description}</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap mt-5">
                        {getSuperEvent?.events?.map((event, index) => (
                            <div
                                key={index}
                                className="w-1/3 flex flex-col items-center rounded-lg p-2 cursor-pointer shadow-md hover:shadow-2xl box-border mb-[20px] mr-[20px]"
                                style={{
                                    width: "calc(33.33% - 20px)",
                                }}
                                onClick={() =>
                                    router.push(`/themes/${event.id}`)
                                }
                            >
                                <Image
                                    src={event.image ? event.image : ""}
                                    width={300}
                                    height={200}
                                    style={{ height: 200, width: "100%" }}
                                    alt="event"
                                />
                                <div className="flex flex-col justify-between w-[100%] gap-2 p-2 ">
                                    <div className="flex items-center justify-between w-[100%]">
                                        <span className="text-base font-bold">{event.title}</span>
                                        <div className="flex gap-2 items-center">
                            <span className="font-thin text-xs">
                      </span>
                                        </div>
                                    </div>
                                    <span className="text-sm">{event.description}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default IndividualEventPage;
