import Link from 'next/link'
import Layout from "../components/Layout";
export default function FourOhFour() {
    return(
        <>
            <Layout title="404">
                <div className="text-center text-3xl">
                    <h1>404 - Сторінка не знайдена</h1>
                    <Link href="/">
                        <a>
                            Повернутись на головну
                        </a>
                    </Link>
                </div>
            </Layout>
        </>
    )
}