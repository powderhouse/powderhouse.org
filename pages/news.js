import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import Header from "../components/Header";
import Footer from "../components/Footer";
import ArrowButton from "../components/ArrowButton";

import {
	baseGrid,
	PageContainer,
	PageSplash,
	PageHeader,
	PageTableOfContents,
	PageTOCListItem,
	PageTOCLink,
	PageIntro,
	SectionHeader,
	PageSection,
	PageSectionContent,
	WidePageSectionContent,
	FullBleedImage,
} from "../components/global.js";

import { getStrapiMedia } from "../lib/media";
import { fetchAPI } from "../lib/api";

function NewsPage({ newsPage, newsCards }) {
	return (
		<PageContainer css={baseGrid}>
			<Header />
			<PageSplash bgColor="yellow" color="off-black">
				<PageHeader>
					{newsPage.data.attributes.PageSplash.PageHeader}
				</PageHeader>
				<PageTableOfContents></PageTableOfContents>
			</PageSplash>
			<PageIntro>{newsPage.data.attributes.PageSplash.PageIntro}</PageIntro>

			<PageSection isLightSection={true} css={baseGrid}>
				{newsCards.data.map((n) => (
					<NewsCard key={n.id} css={baseGrid}>
						<NewsHeader isLeftHeader={true}>
							<NewsDate>{parseDate(n.attributes.NewsDate)}</NewsDate>
							<NewsType>{n.attributes.NewsType}</NewsType>
						</NewsHeader>
						<NewsContent>
							<NewsTitle>
							{n.attributes.NewsTitle}
							</NewsTitle>
							<NewsExcerpt>
								<ReactMarkdown rehypePlugins={[rehypeRaw]}>
									{n.attributes.NewsExcerpt}
								</ReactMarkdown>
							</NewsExcerpt>
							<NewsRelatedLinks>
								{n.attributes.NewsRelatedLinks.map((l) => (
									<a href={l.Link} key={l.id}>
										<li>{l.LinkText}</li>
									</a>
								))}
							</NewsRelatedLinks>
						</NewsContent>
					</NewsCard>
				))}
			</PageSection>

			<Footer />
		</PageContainer>
	);
}

let NewsCard = styled.div`
	grid-column: 1 / -1;
`;

let NewsHeader = styled(SectionHeader)``;

let NewsContent = styled(PageSectionContent)``;

let NewsDate = styled.h3``;

let NewsType = styled.p``;

let NewsTitle = styled.h2`
	font-size: 31px; /*TK Explicit?*/
`;

let NewsExcerpt = styled.p``;

let NewsRelatedLinks = styled.ul``;

function parseDate(dateString) {
    let parts =dateString.split('-');
    let dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    return dateObj.toDateString().split(" ").slice(1).join(" ")
}

export async function getStaticProps(context) {
	let newsPage = await fetchAPI("/news-page?populate=*");
	let newsCards = await fetchAPI("/news-cards?populate=*");
	return {
		props: {
			newsPage: newsPage,
			newsCards: newsCards,
		}, // will be passed to the page component as props
	};
}

export default NewsPage;
