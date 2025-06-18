import { NextResponse } from "next/server";
import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
    try {
        //fetch data from api
        console.log("in try block")


        const apiKey = process.env.API_KEY!
        for (let i = 44; i <= 46; i++) {
            const getIdUrl = `https://api.themoviedb.org/3/movie/changes?page=${i}`
            if (!getIdUrl || !apiKey) {
                console.log("url or api key not found")
                return NextResponse.json({ message: "missing key or url" })
            }
            //get id to pass for details
            const getMovies = await fetch(getIdUrl, {
                method: "GET",
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${apiKey}`
                }
            })
            if (!getMovies.ok) {
                console.log("error in fetching movies")
            }
            const res = await getMovies.json();

            const movieIds = res.results.map((movie: any) => movie.id);
            console.log(movieIds)
            console.log(res.total_pages)

            function delay(time: number) {
                return new Promise(resolve => setTimeout(resolve, time)); //to stop thread
            }
            for (let mId of movieIds) {

                try {
                    await delay(3000);
                    const detail_url = `https://api.themoviedb.org/3/movie/${mId}?language=en-US`
                    const details = await fetch(detail_url, {
                        method: 'GET',
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${apiKey}`
                        }
                    })
                    if (!details.ok) {
                        console.log("error in fetching movie details")
                        continue;
                    }
                    const details_data = await details.json();
                    // const exists = await prisma.movies.findUnique({ where: { id: details_data.id } });
                    // if (exists) {
                    //     console.log("alredy exists")
                    //     continue;
                    // }
                    await prisma.movies.upsert(
                        {
                            where : {id : details_data.id},
                            update : {},
                            create: {
                                id: details_data.id,
                                adult: details_data.adult,
                                genres: details_data.genres,
                                original_language: details_data.original_language,
                                title: details_data.title,
                                overview: details_data.overview,
                                status: details_data.status,
                                vote_average: details_data.vote_average
                            }
                        }
                    )
                    console.log("cretaed successfully")
                } catch (error: unknown) {
                    console.log(error)
                    return NextResponse.json({ message: "error in sec fetch" })
                }
            }
            console.log("page: ", i)
        }
            return NextResponse.json({ message: "nothing" })

        } catch (error: unknown) {
            console.log("error: ", error)
            return NextResponse.json({ error: "something went wrong" }, { status: 500 })
        }
    }