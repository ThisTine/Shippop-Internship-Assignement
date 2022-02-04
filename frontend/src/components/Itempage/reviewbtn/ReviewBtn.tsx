import { Box, CircularProgress, HStack, useToast } from "@chakra-ui/react";
import { FC, useContext, useEffect, useState } from "react";
import { ImStarFull, ImStarHalf, ImStarEmpty } from "react-icons/im";
import { UserContext } from "../../../contexts/UserContext";
import { useAxios } from "../../../functions/axios/useAxios";

const ReviewBtn: FC<{ itemId: string }> = ({ itemId }) => {
  const [displayscore, setdisplayscore] = useState(0);
  const [reviewhover, setreviewhover] = useState(0);
  const [ishover, setishover] = useState(false);
  const [realscore, setrealscore] = useState(0);
  const { userdispatch, review } = useContext(UserContext);
  const [isloading, setisloading] = useState(false);
  const toast = useToast();
  const axios = useAxios();
  useEffect(()=>{
      if(review.map(item=>item.itemID).includes(itemId)){
          setrealscore(review.filter(item=>item.itemID===itemId)[0].rating)
      }
  },[review])
  useEffect(() => {
    setdisplayscore(ishover ? reviewhover : realscore);
  }, [ishover, reviewhover, realscore]);
  const submitreview = async () => {
    try {
      setisloading(true);
      await axios.post("/user/review", { itemId: itemId, review: reviewhover });
      userdispatch({
        type: "setReview",
        review: [
          ...review.filter((item) => item.itemID !== itemId),
          { itemID: itemId, rating: reviewhover },
        ],
      });
      setrealscore(reviewhover);
      setisloading(false);
    } catch (err) {
      toast({ status: "error", title: "Error" });
      setisloading(false);
    }
  };
  if (isloading) {
    return <CircularProgress isIndeterminate={true} />;
  }
  return (
    <HStack
      onMouseEnter={() => setishover(true)}
      onMouseLeave={() => setishover(false)}
      spacing={0}
      fontSize={"2xl"}
      gap={2}
    >
      {[1, 2, 3, 4, 5].map((item) => {
        return (
          <Box
            onClick={() => submitreview()}
            onMouseEnter={() => setreviewhover(item)}
            cursor={"pointer"}
            color={displayscore - (item - 1) > 0 ? "yellow.400" : "gray.100"}
            onMouseLeave={() => setreviewhover(0)}
            key={item}
          >
            <ImStarFull />
          </Box>
        );
      })}
    </HStack>
  );
};

export default ReviewBtn;
