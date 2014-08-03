namespace ProvenStyle.ReadEveryWord.Web.Models
{
    public class Chapter
    {
        public Chapter(int number)
        {
            Number = number;
        }
        public int Number { get; set; }
        public bool Read { get; set; }

    }
}